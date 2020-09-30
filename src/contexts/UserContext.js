import React, { createContext, useReducer } from "react";
import userReduce from "../reducers/userReducer";
import * as Service from "../services/users";

const initialState = {
  user_info: {},
};

export const UserContext = createContext(initialState);
export const UserContextProvider = ({ children }) => {
  const [state] = useReducer(userReduce, initialState);

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      Service.verifyToken(token)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function loginUsingMetamask(payload) {
    return new Promise((resolve, reject) => {
      Service.loginUsingMetamask(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  return (
    <UserContext.Provider
      value={{
        user_info: state.user_info,
        verifyToken,
        loginUsingMetamask,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
