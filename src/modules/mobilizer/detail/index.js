import React from "react";
import { MobilizerContextProvider } from "../../../contexts/MobilizerContext";
import Detail from "./detail";

const index = props => {
  return (
    <MobilizerContextProvider>
      <Detail params={props.match.params} />
    </MobilizerContextProvider>
  );
};

export default index;
