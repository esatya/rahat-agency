import React from "react";

import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

import Statistics from "../statistics";

const Stats = () => {
  return (
    <Card>
      <CardBody className="border-bottom">
        <CardTitle>Overview</CardTitle>
        <CardSubtitle className="mb-0">Total counts</CardSubtitle>
      </CardBody>
      <CardBody>
        <Row className="mt-2">
          <Col md="6" sm="12" lg="4">
            <Statistics
              textColor="orange"
              icon="wallet"
              title="Vendors"
              subtitle="50"
            />
          </Col>
          <Col md="6" sm="12" lg="4">
            <Statistics
              textColor="primary"
              icon="basket"
              title="Projects"
              subtitle="20"
            />
          </Col>
          <Col md="6" sm="12" lg="4">
            <Statistics
              icon="account-box"
              title="Beneficiaries"
              subtitle="500"
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Stats;
