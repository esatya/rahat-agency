import React, { Component } from "react";
import axios from "axios";
import {ethers} from "ethers";
import QRCode from "qrcode.react";

import API from "../../../constants/api";
import CONTRACT from "../../../constants/contracts";
import { getAbi } from "../../../blockchain/abi";
import GrowSpinner from "../../global/GrowSpinner";
import { setInterval, clearInterval } from "timers";
import { getSigner } from "../../../blockchain/abi";

const { ContractFactory } = ethers;

export default class Step4 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: "",
      serverWallet: null,
      progressMsg: "",
      onProgress: false,
    };
    this.state = {
      acceptTerms: true,
    };
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms

    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidMount() {
    this.setupWallet();
    this.interval = setInterval(this.checkAccountBalance, 2000);
  }

async checkAccountBalance() {
    if (this.state.serverWallet) {
      let { signer } = await getSigner();
      let balance = await signer.provider.getBalance(this.state.serverWallet);
      let formatted = ethers.utils.formatUnits(balance);

      if (formatted && parseInt(formatted) >= 5) {
        clearInterval(this.interval);
        return this.isValidated();
      }
    }
  };

  async setupWallet() {
    try {
      let res = await axios.get(`${API.APP}/setup/wallet`);
      this.setState({
        ...this.state,
        serverWallet: res.data.address,
        onProgress: true,
        progressMsg:
          "Please transfer 5 ethers to the account address given below to continue setup...",
      });
    } catch (err) {
      this.setState({
        ...this.state,
        hasError: true,
        onProgress: false,
        errorMessage:
          "Account has already been setup. Please go back to login.",
      });
    }
  }

  async deployContract(contractName) {
    try {
      const signer = await getSigner();
      const res = await axios.get(
        `${API.APP}/contracts/${contractName}/bytecode`
      );
      const abi = await getAbi(CONTRACT.RAHATADMIN);
      const server = await axios.get(`${API.APP}/setup/wallet`);
      const factory = new ContractFactory(abi, res.data.bytecode, signer);

      const contract = await factory.deploy(
        this.props.getStore().supply,
        this.props.getStore().tokenName,
        this.props.getStore().symbol,
        server.data.address
      );
      let rahat_contract_addr = await contract.rahatContract();
      let token_contract = await contract.tokenContract();
      return {
        rahat_admin: contract.address,
        rahat: rahat_contract_addr,
        token: token_contract,
      };
    } catch (e) {
      let error_msg = "Contract deploy failed. Please contact system admin!!!";
      if (e.code === 4001) error_msg = e.message;
      this.setState({
        ...this.state,
        hasError: true,
        errorMessage: error_msg,
      });
    }
  }

  createAgencyPayload() {
    return {
      name: this.props.getStore().name,
      phone: this.props.getStore().phone,
      email: this.props.getStore().email,
      address: this.props.getStore().address,
      admin: {
        name: this.props.getStore().name,
        phone: this.props.getStore().phone,
        email: this.props.getStore().email,
        wallet_address: this.props.getStore().eth_address,
      },
      token: {
        name: this.props.getStore().tokenName,
        symbol: this.props.getStore().symbol,
        supply: this.props.getStore().supply,
      },
    };
  }

 async isValidated (){
    const userInput = this._grabUserInput();
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (
      Object.keys(validateNewInput).every((k) => {
        return validateNewInput[k] === true;
      })
    ) {
      if (this.props.getStore().acceptTerms !== userInput.acceptTerms) {
        this.props.updateStore({
          ...userInput,
          acceptTerms: true,
          savedToCloud: false,
        });
      }

      try {
        this.setState({
          ...this.state,
          onProgress: true,
          progressMsg:
            "Please wait and do not close this window. Your account is being setup...",
        });
        let data = this.createAgencyPayload();
        setTimeout(() => {
          this.setState({
            ...this.state,
            progressMsg:
              "You are almost there, you will be redirected to login page...",
          });
        }, 9000);
        let signup = await axios.post(`${API.APP}/setup`, data);
        if (signup) {
          this.setState({
            ...this.state,
            hasError: false,
            errorMessage: "",
            progressMsg: "",
            onProgress: false,
          });
          window.location.replace("/auth/wallet");
          return;
        }
      } catch (err) {
        let error_msg = "Account setup failed. Please contact system admin!!!";
        this.setState({
          ...this.state,
          hasError: true,
          onProgress: false,
          errorMessage: error_msg,
          progressMsg: "",
        });
      }
    } else {
      this.setState(
        Object.assign(
          userInput,
          validateNewInput,
          this._validationErrors(validateNewInput)
        )
      );
    }

    return isDataValid;
  };

  validationCheck() {
    if (!this._validateOnDemand) return;

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator

    this.setState(
      Object.assign(
        userInput,
        validateNewInput,
        this._validationErrors(validateNewInput)
      )
    );
  }

  _validateData(data) {
    return {
      acceptTermsVal: data.acceptTerms !== "false", // required: anything besides N/A
    };
  }

  _validationErrors(val) {
    const errMsgs = {
      acceptTermsValMsg: val.acceptTermsVal
        ? ""
        : "Please accept the terms and conditions",
    };
    return errMsgs;
  }

  _grabUserInput() {
    return {
      acceptTerms: this.state.acceptTerms,
    };
  }

  handleCheckboxChange() {
    this.setState((state) => ({
      acceptTerms: !state.acceptTerms,
    }));
  }

  render() {
    let notValidClasses = {};
    if (
      typeof this.state.acceptTermsVal === "undefined" ||
      this.state.acceptTermsVal
    ) {
      notValidClasses.nameCls = "form-control";
    } else {
      notValidClasses.nameCls = "is-invalid form-control";
      notValidClasses.nameValGrpCls = "text-danger";
    }
    return (
      <div className="step step4 mt-5">
        <div className="row justify-content-md-center">
          <div className="col col-lg-6">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h3>Step 4: Account setup</h3>
              </label>
              <div>
                {this.state.hasError ? (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {this.state.errorMessage}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <form>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label">
                  <strong>Agency Name</strong>
                </label>
                <div className="col-sm-10 col-form-label">
                  {this.props.getStore().name}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="email" className="col-sm-2 col-form-label">
                  <strong>Agency Email</strong>
                </label>
                <div className="col-sm-10 col-form-label">
                  {this.props.getStore().email}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label">
                  <strong>Agency Address</strong>
                </label>
                <div className="col-sm-10 col-form-label">
                  {this.props.getStore().address}
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="eth_address"
                  className="col-sm-2 col-form-label"
                >
                  <strong>Ethereum Address</strong>
                </label>
                <div className="col-sm-10 col-form-label">
                  {this.props.getStore().eth_address}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="tokenName" className="col-sm-2 col-form-label">
                  <strong>Token Name</strong>
                </label>
                <div className="col-sm-10 col-form-label">
                  {this.props.getStore().tokenName}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="symbol" className="col-sm-2 col-form-label">
                  <strong>Symbol</strong>
                </label>
                <div className="col-sm-10 col-form-label">
                  {this.props.getStore().symbol}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="supply" className="col-sm-2 col-form-label">
                  <strong>Total Supply</strong>
                </label>
                <div className="col-sm-10 col-form-label">
                  {this.props.getStore().supply}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-12">
                  {this.state.onProgress ? <GrowSpinner /> : ""}
                  <p>
                    <strong>{this.state.progressMsg}</strong>
                  </p>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-12">
                  {this.state.serverWallet ? (
                    <div>
                      <div style={{ marginLeft: 50 }}>
                        <QRCode size={250} value={this.state.serverWallet} />
                      </div>
                      <br />
                      <strong>
                        {this.state.serverWallet}{" "}
                        <a
                          href="#copy"
                          title="Copy Address"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              this.state.serverWallet
                            )
                          }
                        >
                          <i className="mr-2 mdi mdi-content-copy"></i>
                        </a>
                      </strong>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group content form-block-holder">
                <div
                  style={{ color: "red" }}
                  className={notValidClasses.nameValGrpCls}
                >
                  {this.state.acceptTermsValMsg}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
