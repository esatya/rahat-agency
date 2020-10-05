import React from "react";

import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

const Index = () => {
  return (
    <Card>
      <CardBody style={{ minHeight: 196 }}>
        <CardTitle>Tokens</CardTitle>
        <CardSubtitle>Total tokens released by agency </CardSubtitle>
        <br />
        <h2 className="font-medium">
          <i className="fas fa-box-open"></i>&nbsp; 5000000
        </h2>
      </CardBody>
      <div className="earningsbox mt-1"></div>
    </Card>
  );
};

export default Index;
