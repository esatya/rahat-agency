import React from "react";

import DetailsForm from "./DetailsForm";
import { AgencyContextProvider } from "../../../contexts/AgencyContext";

const Details = (props) => {
  return (
    <AgencyContextProvider>
      <DetailsForm params={props.match.params} />
    </AgencyContextProvider>
  );
};

export default Details;
