import React, { Component } from "react";
import { InputGroup, InputGroupAddon, Button } from "reactstrap";
import { getSigner } from "../../../blockchain/abi";

export default class Step2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eth_address: props.getStore().eth_address,
    };
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms

    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
    this.handleLoadAddressClick = this.handleLoadAddressClick.bind(this);
  }

  async handleLoadAddressClick() {
    let { signer } = await getSigner();
    const _address = await signer.getAddress();
    this.setState({ eth_address: _address });
  }

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (
      Object.keys(validateNewInput).every((k) => {
        return validateNewInput[k] === true;
      })
    ) {
      if (this.props.getStore().eth_address !== userInput.eth_address) {
        // only update store of something changed
        this.props.updateStore({
          ...userInput,
          savedToCloud: false, // use this to notify step4 that some changes took place and prompt the user to save again
        }); // Update store here (this is just an example, in reality you will do it via redux or flux)
      }

      isDataValid = true;
    } else {
      // if anything fails then update the UI validation state but NOT the UI Data State
      this.setState(
        Object.assign(
          userInput,
          validateNewInput,
          this._validationErrors(validateNewInput)
        )
      );
    }

    return isDataValid;
  }

  validationCheck() {
    if (!this._validateOnDemand) return;

    const userInput = this._grabUserInput(); // grab user entered vals
    console.log({ userInput });
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
      ethAddressVal: /^0x[a-fA-F0-9]{40}$/.test(data.eth_address),
    };
  }

  _validationErrors(val) {
    const errMsgs = {
      ethAddressValMsg: val.ethAddressVal
        ? ""
        : "Valid Ethereum Address is required",
    };
    return errMsgs;
  }

  _grabUserInput() {
    return {
      eth_address: this.eth_address.value,
    };
  }
  render() {
    let notValidClasses = {};

    if (
      typeof this.state.ethAddressVal === "undefined" ||
      this.state.ethAddressVal
    ) {
      notValidClasses.nameCls = "form-control";
    } else {
      notValidClasses.nameCls = "is-invalid form-control";
      notValidClasses.nameValGrpCls = "text-danger";
    }
    return (
      <div className="step step2 mt-5">
        <div className="row justify-content-md-center">
          <div className="col col-lg-6">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h3>Step 2: Enter blockchain details</h3>
              </label>
            </div>
            <form>
              <div className="form-group content form-block-holder">
                <label className="control-label">Ethereum Address</label>
                <InputGroup>
                  <input
                    ref={(e) => {
                      this.eth_address = e;
                    }}
                    autoComplete="off"
                    type="text"
                    placeholder="Enter ethereum address"
                    className={notValidClasses.nameCls}
                    required
                    defaultValue={this.state.eth_address}
                    onBlur={this.validationCheck}
                  />

                  <InputGroupAddon addonType="append">
                    <Button
                      className="btn btn-warning"
                      onClick={this.handleLoadAddressClick}
                    >
                      Get metamask account
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <div className={notValidClasses.nameValGrpCls}>
                  {this.state.ethAddressValMsg}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
