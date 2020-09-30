import React, { useContext } from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  CardTitle,
} from "reactstrap";

import { AppContext } from "../../../contexts/AppSettingsContext";
import img1 from "../../../assets/images/background/active-bg.png";

const Index = () => {
  const { appSettings } = useContext(AppContext);
  return (
    <Row className="my-4">
      <Col lg="8">
        <Card className="card-hover">
          <CardBody>
            <div className="d-md-flex align-items-center">
              <div>
                <CardTitle>Agency profile</CardTitle>
              </div>
              <div className="ml-auto align-items-center"></div>
            </div>

            <Form>
              <FormGroup>
                <Label>Name</Label>
                <InputGroup>
                  <Input
                    readOnly
                    type="text"
                    name="name"
                    value={
                      appSettings && appSettings.agency
                        ? appSettings.agency.name
                        : "n/a"
                    }
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label>Address</Label>
                <InputGroup>
                  <Input
                    readOnly
                    type="text"
                    name="address"
                    value={
                      appSettings && appSettings.agency
                        ? appSettings.agency.address
                        : "n/a"
                    }
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <InputGroup>
                  <Input
                    readOnly
                    type="text"
                    name="email"
                    value={
                      appSettings && appSettings.agency
                        ? appSettings.agency.email
                        : "n/a"
                    }
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label>Phone</Label>
                <InputGroup>
                  <Input
                    readOnly
                    type="text"
                    name="phone"
                    value={
                      appSettings && appSettings.agency
                        ? appSettings.agency.phone
                        : "n/a"
                    }
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label>Wallet Address</Label>
                <InputGroup>
                  <Input
                    readOnly
                    type="text"
                    name="wallet_address"
                    value={
                      appSettings && appSettings.wallet_address
                        ? appSettings.wallet_address
                        : "n/a"
                    }
                  />
                </InputGroup>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
      <Col lg="4">
        <Card className="card-hover">
          <CardBody style={{ background: `url(${img1}) no-repeat top center` }}>
            <div className="pt-3 text-center" style={{ minHeight: 415 }}>
              <i className="mdi mdi-file-chart display-4 text-orange d-block"></i>
              <span className="display-4 d-block font-medium">
                {appSettings.agency ? appSettings.agency.token.supply : 0}
              </span>
              <span>Total Tokens.</span>
              <hr />
              <Row className="mt-4 mb-4">
                <Col xs="4" md="12" lg="4" className="border-right text-left">
                  <h4 className="mb-0 font-medium">
                    {appSettings.agency ? appSettings.agency.token.name : "n/a"}
                  </h4>
                  Name
                </Col>
                <Col
                  xs="4"
                  md="12"
                  lg="4"
                  className="border-right text-md-left"
                >
                  <h4 className="mb-0 font-medium">
                    {appSettings.agency
                      ? appSettings.agency.token.symbol
                      : "n/a"}
                  </h4>
                  Symbol
                </Col>
                <Col xs="4" md="12" lg="4" className="text-right text-md-left">
                  <h4 className="mb-0 font-medium">
                    {appSettings.agency &&
                    appSettings.agency.is_approved === true
                      ? "Yes"
                      : "No"}
                  </h4>
                  Approved
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Index;
