import React from "react";
import { MobilizerContextProvider } from "../../contexts/MobilizerContext";
import List from "./list";

const index = () => {
  return (
    <MobilizerContextProvider>
      <List />
    </MobilizerContextProvider>
  );
};

export default index;
