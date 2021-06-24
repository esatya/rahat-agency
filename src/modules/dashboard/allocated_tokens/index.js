import React from "react";

import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

const Index = (props) => {
  return (
    <Card>
      <CardBody style={{ minHeight: 196 }}>
        <CardTitle>Tokens</CardTitle>
        <CardSubtitle>Total tokens released by agency </CardSubtitle>
        <br />
        <h2 className="font-medium">
          <i className="fas fa-box-open"></i>&nbsp; {props.allocatedTokens}
        </h2>
      </CardBody>
      <div className="earningsbox mt-1"></div>
    </Card>
  );
};

export default Index;
