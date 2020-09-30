import React from "react";
import { AgencyContextProvider } from "../../../contexts/AgencyContext";
import ListTable from "./ListTable";

const List = () => {
  return (
    <AgencyContextProvider>
      <ListTable />
    </AgencyContextProvider>
  );
};

export default List;
