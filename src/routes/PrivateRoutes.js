import React from "react";
import { Route, Redirect } from "react-router-dom";

import { getUser } from "../utils/sessionManager";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const currentUser = getUser();

      return currentUser ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/setup",
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);

export default PrivateRoute;
