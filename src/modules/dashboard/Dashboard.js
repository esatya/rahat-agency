import React from "react";
import { Row, Col } from "reactstrap";

import AgencyTokens from "./agency_tokens";
import TotalStats from "./total_stats";
import MonthlyStats from "./monthly_stats";

const Dashboard = () => {
  return (
    <>
      <Row>
        <Col md="4">
          <AgencyTokens />
        </Col>
        <Col md="8">
          <TotalStats />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <MonthlyStats />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
