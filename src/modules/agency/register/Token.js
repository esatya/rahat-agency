import React, { Component } from "react";

export default class Step3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tokenName: props.getStore().tokenName,
      symbol: props.getStore().symbol,
      supply: props.getStore().supply,
    };
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms

    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
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
      if (
        this.props.getStore().tokenName !== userInput.tokenName ||
        this.props.getStore().symbol !== userInput.symbol ||
        this.props.getStore().supply !== userInput.supply
      ) {
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
      tokenNameVal: data.tokenName !== "", // required: anything besides N/A
      symbolVal: data.symbol !== "",
      supplyVal: data.supply !== "",
    };
  }

  _validationErrors(val) {
    const errMsgs = {
      tokenNameValMsg: val.tokenNameVal ? "" : "Token Name is required",
      symbolValMsg: val.symbolVal ? "" : "Symbol Name is required",
      supplyValMsg: val.supplyVal ? "" : "Total Supply is required",
    };
    return errMsgs;
  }

  _grabUserInput() {
    return {
      tokenName: this.tokenName.value,
      symbol: this.symbol.value,
      supply: this.supply.value,
    };
  }
  render() {
    let notValidClasses = {};

    if (
      typeof this.state.tokenNameVal === "undefined" ||
      this.state.tokenNameVal
    ) {
      notValidClasses.nameCls = "form-control";
    } else {
      notValidClasses.nameCls = "is-invalid form-control";
      notValidClasses.nameValGrpCls = "text-danger";
    }
    if (typeof this.state.symbolVal === "undefined" || this.state.symbolVal) {
      notValidClasses.symbolCls = "form-control";
    } else {
      notValidClasses.symbolCls = "is-invalid form-control";
      notValidClasses.symbolValGrpCls = "text-danger";
    }
    if (typeof this.state.supplyVal === "undefined" || this.state.supplyVal) {
      notValidClasses.supplyCls = "form-control";
    } else {
      notValidClasses.supplyCls = "is-invalid form-control";
      notValidClasses.supplyValGrpCls = "text-danger";
    }
    return (
      <div className="step step3 mt-5">
        <div className="row justify-content-md-center">
          <div className="col col-lg-6">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h3>Step 3: Setup your agency token</h3>
              </label>
            </div>
            <form>
              <div className="form-group content form-block-holder">
                <label className="control-label">Token Name</label>
                <div>
                  <input
                    ref={(e) => {
                      this.tokenName = e;
                    }}
                    autoComplete="off"
                    type="text"
                    placeholder="Agency Token Name"
                    className={notValidClasses.nameCls}
                    required
                    defaultValue={this.state.tokenName}
                    onBlur={this.validationCheck}
                  />
                  <div className={notValidClasses.nameValGrpCls}>
                    {this.state.tokenNameValMsg}
                  </div>
                </div>
              </div>
              <div className="form-group content form-block-holder">
                <label className="control-label">Symbol</label>
                <div>
                  <input
                    ref={(f) => {
                      this.symbol = f;
                    }}
                    autoComplete="off"
                    type="text"
                    placeholder="Symbol Name like BTC or ETH"
                    className={notValidClasses.symbolCls}
                    required
                    defaultValue={this.state.symbol}
                    onBlur={this.validationCheck}
                  />
                  <div className={notValidClasses.symbolValGrpCls}>
                    {this.state.symbolValMsg}
                  </div>
                </div>
              </div>
              <div className="form-group content form-block-holder">
                <label className="control-label">Total Supply</label>
                <div>
                  <input
                    ref={(g) => {
                      this.supply = g;
                    }}
                    autoComplete="off"
                    type="number"
                    placeholder="Number of Tokens for circulation"
                    className={notValidClasses.supplyCls}
                    required
                    defaultValue={this.state.supply}
                    onBlur={this.validationCheck}
                  />
                  <div className={notValidClasses.supplyValGrpCls}>
                    {this.state.supplyValMsg}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
