import React, { createContext, useReducer } from "react";
import agencyReduce from "../reducers/agencyReducer";
import * as Service from "../services/agency";
import ACTION from "../actions/agency";

const initialState = {
  agency: [],
  pagination: { total: 0, limit: 20, start: 0, currentPage: 1, totalPages: 0 },
  agency_details: null,
  loading: false,
};

export const AgencyContext = createContext(initialState);
export const AgencyContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(agencyReduce, initialState);

  function setLoading() {
    dispatch({ type: ACTION.SET_LOADING });
  }

  function resetLoading() {
    dispatch({ type: ACTION.RESET_LOADING });
  }

  function deployAgencyToken(agencyId, payload) {
    return new Promise((resolve, reject) => {
      Service.deployAgencyToken(agencyId, payload)
        .then((res) => {
          dispatch({ type: ACTION.DEPLOY_TOKEN_SUCCESS, res });
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function getAgencyDetails(agencyId) {
    return new Promise((resolve, reject) => {
      Service.getAgencyDetails(agencyId)
        .then((res) => {
          dispatch({ type: ACTION.GET_AGENCY_SUCCESS, res });
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function listAgency(query) {
    return new Promise((resolve, reject) => {
      Service.listAgency(query)
        .then((res) => {
          dispatch({ type: ACTION.LIST_SUCCESS, res });
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function approveAgency(agencyId) {
    return new Promise((resolve, reject) => {
      Service.approveAgency(agencyId)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  return (
    <AgencyContext.Provider
      value={{
        agency: state.agency,
        loading: state.loading,
        pagination: state.pagination,
        agency_details: state.agency_details,
        listAgency,
        setLoading,
        resetLoading,
        approveAgency,
        getAgencyDetails,
        deployAgencyToken,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};
