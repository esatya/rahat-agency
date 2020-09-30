import React from "react";
import { VendorContextProvider } from "../../contexts/VendorContext";
import List from "./list";

const index = () => {
  return (
    <VendorContextProvider>
      <List />
    </VendorContextProvider>
  );
};

export default index;
