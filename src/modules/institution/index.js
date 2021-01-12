import React from "react";
import { InstitutionContextProvider } from "../../contexts/InstitutionContext";
import List from "./list";

const index = () => {
  return (
    <InstitutionContextProvider>
      <List />
    </InstitutionContextProvider>
  );
};

export default index;
