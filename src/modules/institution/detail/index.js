import React from "react";
import { InstitutionContextProvider } from "../../../contexts/InstitutionContext";
import Detail from "./detail";

const index = (props) => {
  return (
    <InstitutionContextProvider>
      <Detail params={props.match.params} />
    </InstitutionContextProvider>
  );
};

export default index;
