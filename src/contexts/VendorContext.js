import React, { createContext, useReducer,useContext } from "react";
import vendorReduce from "../reducers/vendorReducer";
import * as Service from "../services/vendor";
import * as AidService from "../services/aid";
import ACTION from "../actions/vendor";
import {AppContext} from './AppSettingsContext';

const initialState = {
  list: [],
  pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
  aid: "",
  aids: [],
  vendor: {},
  loading: false,
  transactionHistory: [],
};

export const VendorContext = createContext(initialState);
export const VendorContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(vendorReduce, initialState);
  const {wallet,appSettings,changeIsverified} = useContext(AppContext);

  async function getVendorBalance(contract_addr, wallet_address) {
    return Service.getVendorBalance(contract_addr, wallet_address);
  }

  async function listAid() {
    const d = await AidService.listAid({ start: 0, limit: 20 });
    dispatch({ type: ACTION.LIST_AID, data: { aids: d.data } });
  }

  function setAid(aid) {
    dispatch({ type: ACTION.SET_AID, data: aid });
  }

  function clear() {
    dispatch({
      type: ACTION.LIST,
      data: {
        limit: 10,
        start: 0,
        total: 0,
        data: [],
        page: 0,
        name: "",
        phone: "",
      },
    });
  }

  async function approveVendor( payload) {
    const { rahat:rahatContractAddr } = appSettings.agency.contracts;
    const res = await Service.approveVendor(wallet,payload,rahatContractAddr);
    changeIsverified(false);
    if (res) {
      setVendor(res.data);
      return res.data;
    }
  }

  async function changeVendorStatus(vendorId, status) {
    const res = await Service.changeVendorStaus(vendorId, status);
    setVendor(res.data);
    return res.data;
  }

  function setVendor(b) {
    dispatch({ type: ACTION.SET_VENDOR, data: b });
  }

  async function getVendorDetails(id) {
    const data = await Service.get(id);
    setVendor(data);
    return data;
  }

  function addVendor(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      wallet_address: formData.get("ethaddress"),
      email: formData.get("email"),
      address: formData.get("address"),
      govt_id: formData.get("govt_id"),
    };

    return new Promise((resolve, reject) => {
      Service.add(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function setLoading() {
    dispatch({ type: ACTION.SET_LOADING });
  }

  function resetLoading() {
    dispatch({ type: ACTION.RESET_LOADING });
  }

  async function listVendor(params) {
    let res = await Service.list(params);
    if (res) {
      dispatch({
        type: ACTION.LIST,
        data: res,
      });
      return res;
    }
  }

  async function getVendorTransactions(vendorId) {
    let res = await Service.vendorTransactions(vendorId);
    if (res) {
      dispatch({
        type: ACTION.VENDOR_TX,
        data: res,
      });
      return res;
    }
  }

  return (
    <VendorContext.Provider
      value={{
        list: state.list,
        aid: state.aid,
        aids: state.aids,
        vendor: state.vendor,
        loading: state.loading,
        pagination: state.pagination,
        transactionHistory: state.transactionHistory,
        listVendor,
        listAid,
        setAid,
        clear,
        addVendor,
        setVendor,
        setLoading,
        resetLoading,
        approveVendor,
        getVendorDetails,
        changeVendorStatus,
        getVendorBalance,
        getVendorTransactions,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};
