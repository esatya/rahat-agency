import React from "react";
import { OnboardContextProvider } from "../../contexts/OnboardContext";
import List from "./list";

const index = () => {
  return (
    <OnboardContextProvider>
      <List />
    </OnboardContextProvider>
  );
};

export default index;
