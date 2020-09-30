import React, { createContext, useReducer } from "react";
import vendorReduce from "../reducers/vendorReducer";
import * as Service from "../services/vendor";
import * as AidService from "../services/aid";
import ACTION from "../actions/vendor";

const initialState = {
  list: [],
  pagination: { limit: 10, start: 0, total: 0, page: 0 },
  query: { name: "", phone: "" },
  aid: "",
  aids: [],
  vendor: {},
  loading: false,
};

export const VendorContext = createContext(initialState);
export const VendorContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(vendorReduce, initialState);

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

  async function approveVendor(vendorId, payload) {
    const res = await Service.approveVendor(vendorId, payload);
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

  function listVendor(params) {
    return new Promise((resolve, reject) => {
      if (!params)
        params = {
          ...state.pagination,
          aid: state.aid,
          ...state.query,
        };

      setAid(params.aid);
      Service.list(params).then((d) => {
        let pg = parseInt(d.total / d.limit);
        if (d.total - pg * d.limit > 0) {
          pg = pg + 1;
        }
        dispatch({
          type: ACTION.LIST,
          data: { ...d, page: pg, name: params.name, phone: params.phone },
        });
        resolve(d);
      });
    });
  }

  return (
    <VendorContext.Provider
      value={{
        list: state.list,
        aid: state.aid,
        query: state.query,
        aids: state.aids,
        vendor: state.vendor,
        loading: state.loading,
        pagination: state.pagination,
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
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};
