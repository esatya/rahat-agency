import React, { Component } from "react";

export default class Step1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.getStore().email,
      name: props.getStore().name,
      address: props.getStore().address,
      phone: props.getStore().phone,
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
        this.props.getStore().email !== userInput.email ||
        this.props.getStore().name !== userInput.name ||
        this.props.getStore().address !== userInput.address ||
        this.props.getStore().phone !== userInput.phone
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
      nameVal: data.name !== "", // required: anything besides N/A
      addressVal: data.address !== "",
      phoneVal: data.phone !== "" && data.phone.length === 10,
      emailVal: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        data.email
      ), // required: regex w3c uses in html5
    };
  }

  _validationErrors(val) {
    const errMsgs = {
      nameValMsg: val.nameVal ? "" : "Agency name is required",
      emailValMsg: val.emailVal ? "" : "A valid email is required",
      addressValMsg: val.addressVal ? "" : "A valid address is required",
      phoneValMsg: val.phoneVal ? "" : "Provide valid phone",
    };
    return errMsgs;
  }

  _grabUserInput() {
    return {
      name: this.name.value,
      email: this.email.value,
      address: this.address.value,
      phone: this.phone.value,
    };
  }
  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.nameVal === "undefined" || this.state.nameVal) {
      notValidClasses.nameCls = "form-control";
    } else {
      notValidClasses.nameCls = "is-invalid form-control";
      notValidClasses.nameValGrpCls = "text-danger";
    }

    if (typeof this.state.addressVal === "undefined" || this.state.addressVal) {
      notValidClasses.addressCls = "form-control";
    } else {
      notValidClasses.addressCls = "is-invalid form-control";
      notValidClasses.addressValGrpCls = "text-danger";
    }

    if (typeof this.state.emailVal === "undefined" || this.state.emailVal) {
      notValidClasses.emailCls = "form-control";
    } else {
      notValidClasses.emailCls = "is-invalid form-control";
      notValidClasses.emailValGrpCls = "text-danger";
    }
    if (typeof this.state.phoneVal === "undefined" || this.state.phoneVal) {
      notValidClasses.phoneCls = "form-control";
    } else {
      notValidClasses.phoneCls = "is-invalid form-control";
      notValidClasses.phoneValGrpCls = "text-danger";
    }

    return (
      <div className="step step1 mt-5 ">
        <div className="row justify-content-md-center">
          <div className="col col-lg-6">
            <div className="">
              <h3>Welcome, Please enter agency details</h3>
              <form id="Form" className="form-horizontal mt-2">
                <div className="form-group content form-block-holder">
                  <label className="control-label">Agency Name</label>
                  <div>
                    <input
                      ref={(e) => {
                        this.name = e;
                      }}
                      autoComplete="off"
                      type="text"
                      placeholder="Name"
                      className={notValidClasses.nameCls}
                      required
                      defaultValue={this.state.name}
                      onBlur={this.validationCheck}
                    />
                    <div className={notValidClasses.nameValGrpCls}>
                      {this.state.nameValMsg}
                    </div>
                  </div>
                </div>
                <div className="form-group content form-block-holder">
                  <label className="control-label ">Agency Email</label>
                  <div>
                    <input
                      ref={(f) => {
                        this.email = f;
                      }}
                      autoComplete="off"
                      type="email"
                      placeholder="john.smith@example.com"
                      className={notValidClasses.emailCls}
                      required
                      defaultValue={this.state.email}
                      onBlur={this.validationCheck}
                    />
                    <div className={notValidClasses.emailValGrpCls}>
                      {this.state.emailValMsg}
                    </div>
                  </div>
                </div>
                <div className="form-group content form-block-holder">
                  <label className="control-label ">Agency Address</label>
                  <div>
                    <input
                      ref={(f) => {
                        this.address = f;
                      }}
                      autoComplete="off"
                      type="text"
                      placeholder="address"
                      className={notValidClasses.addressCls}
                      required
                      defaultValue={this.state.address}
                      onBlur={this.validationCheck}
                    />
                    <div className={notValidClasses.addressValGrpCls}>
                      {this.state.addressValMsg}
                    </div>
                  </div>
                </div>
                <div className="form-group content form-block-holder">
                  <label className="control-label ">Phone</label>
                  <div>
                    <input
                      ref={(g) => {
                        this.phone = g;
                      }}
                      autoComplete="off"
                      type="text"
                      placeholder="Enter Phone No"
                      className={notValidClasses.phoneCls}
                      required
                      defaultValue={this.state.phone}
                      onBlur={this.validationCheck}
                    />
                    <div className={notValidClasses.phoneValGrpCls}>
                      {this.state.phoneValMsg}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
