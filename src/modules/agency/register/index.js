import React, { Component } from "react";
import StepZilla from "react-stepzilla";
import { Card, CardBody, CardTitle } from "reactstrap";

import Step1 from "./AccountInformation";
import Step2 from "./BlockchainInformation";
import Step3 from "./Token";
import Step4 from "./Declaration";
import Step5 from "./Finish";

class FormSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNavigation: true,
    };

    this.sampleStore = {
      email: "",
      name: "",
      password: "",
      cnfrmPassword: "",
      eth_address: "",
      tokenNameVal: "",
      symbolVal: "",
      supplyVal: "",
    };
  }

  toggleNavigation() {
    this.setState({ showNavigation: !this.state.showNavigation });
  }

  getStore() {
    return this.sampleStore;
  }

  updateStore(update) {
    this.sampleStore = {
      ...this.sampleStore,
      ...update,
    };
  }

  render() {
    const steps = [
      {
        name: "1. Account Information",
        component: (
          <Step1
            getStore={() => this.getStore()}
            updateStore={(u) => {
              this.updateStore(u);
            }}
          />
        ),
      },
      {
        name: "2. Blockchain Setup",
        component: (
          <Step2
            getStore={() => this.getStore()}
            updateStore={(u) => {
              this.updateStore(u);
            }}
          />
        ),
      },
      {
        name: "3. Token Creation",
        component: (
          <Step3
            getStore={() => this.getStore()}
            updateStore={(u) => {
              this.updateStore(u);
            }}
          />
        ),
      },
      {
        name: "4. Declaration",
        component: (
          <Step4
            getStore={() => this.getStore()}
            updateStore={(u) => {
              this.updateStore(u);
            }}
          />
        ),
      },
      {
        name: "5. Finish",
        component: (
          <Step5
            getStore={() => this.getStore()}
            updateStore={(u) => {
              this.updateStore(u);
            }}
          />
        ),
      },
    ];

    return (
      <Card>
        <CardBody className="border-bottom">
          <CardTitle className="mb-0">
            <i className="mdi mdi-border-right mr-2"></i>Register Your Agency
          </CardTitle>
          <h6 className="card-subtitle mb-0 mt-1">
            Fill up the form to register your agency for Cash-Aid Programme.
          </h6>
        </CardBody>
        <CardBody>
          <div className="example">
            <div className="step-progress">
              <StepZilla
                onStepChange={(step) => step === 3 && this.toggleNavigation()}
                steps={steps}
                prevBtnOnLastStep={false}
                nextTextOnFinalActionStep={"Next"}
                showNavigation={this.state.showNavigation}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default FormSteps;
