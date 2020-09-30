import React from "react";
import { VendorContextProvider } from "../../../contexts/VendorContext";
import Detail from "./detail";

const index = props => {
  return (
    <VendorContextProvider>
      <Detail params={props.match.params} />
    </VendorContextProvider>
  );
};

export default index;
