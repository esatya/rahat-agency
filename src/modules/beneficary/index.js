import React from "react";
import { BeneficiaryContextProvider } from "../../contexts/BeneficiaryContext";
import List from "./list";

const index = () => {
  return (
    <BeneficiaryContextProvider>
      <List />
    </BeneficiaryContextProvider>
  );
};

export default index;
