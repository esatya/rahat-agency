import React, { createContext, useReducer } from "react";
import onboardReduce from "../reducers/onboardReducer";
import * as Service from "../services/onboard";
import ACTION from "../actions/onboard";

const initialState = {
  data: [],
  pagination: { total: 0, limit: 20, start: 0, currentPage: 1, totalPages: 0 },
  query: { agency: "" },
  loading: false
};

export const OnboardContext = createContext(initialState);
export const OnboardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(onboardReduce, initialState);

  function setLoading() {
    dispatch({ type: ACTION.SET_LOADING });
  }

  function resetLoading() {
    dispatch({ type: ACTION.RESET_LOADING });
  }

  function list(query) {
    if (!query)
      query = {
        ...state.pagination,
        ...state.query
      };

    return new Promise((resolve, reject) => {
      Service.list(query)
        .then(d => {
          dispatch({ type: ACTION.LIST, data: d });
          resolve(d);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  async function issue(id, issued) {
    return Service.issue(id, { issued });
  }

  return (
    <OnboardContext.Provider
      value={{
        data: state.data,
        loading: state.loading,
        pagination: state.pagination,
        list,
        setLoading,
        resetLoading,
        issue
      }}
    >
      {children}
    </OnboardContext.Provider>
  );
};
