import React from "react";
import { CardTitle, Card, CardBody, Row, Col } from "reactstrap";

import AidDetails from "./AidDetails";
import BeneficiaryList from "./BeneficiaryList";
import TokenDetails from "./TokenDetails";

export default function Details({ match }) {
  const aidId = match.params.id;
  return (
    <>
      <Row>
        <Col md="6">
          <Card style={{ minHeight: 484 }}>
            <CardTitle className="mb-0 p-3 border-bottom bg-light">
              Project Details
            </CardTitle>
            <CardBody>
              <AidDetails aidId={aidId} />
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card>
            <CardTitle className="mb-0 p-3 border-bottom bg-light">
              Token Details
            </CardTitle>
            <CardBody>
              <TokenDetails aidId={aidId} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <div className="bg-light border-bottom p-3 mb-0 card-title">
                <i className="mdi mdi-border-right mr-2"></i>Beneficiary List
              </div>
              <BeneficiaryList aidId={aidId} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
