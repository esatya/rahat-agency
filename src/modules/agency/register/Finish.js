import React, { Component } from "react";

export default class Step5 extends Component {
  render() {
    return (
      <div className="step step5 mt-5 ">
        <div className="row justify-content-md-center">
          <div className="col col-lg-6">
            <div>
              <h4>Registration Completed Successfully!</h4>
            </div>
            <div>
              <p>Your setup is complete. Please continue to login. </p>
            </div>
            <div>
              <a className="btn btn-success" href="/auth/wallet">
                <i className="fas fa-home"></i> Continue
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
