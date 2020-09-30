import React from "react";
import { BeneficiaryContextProvider } from "../../../contexts/BeneficiaryContext";
import Detail from "./detail";

const index = props => {
  return (
    <BeneficiaryContextProvider>
      <Detail params={props.match.params} />
    </BeneficiaryContextProvider>
  );
};

export default index;
