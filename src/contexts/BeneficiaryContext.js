import React, { createContext, useReducer } from "react";
import beneficiaryReduce from "../reducers/beneficiaryReducer";
import * as Service from "../services/beneficiary";
import * as AidService from "../services/aid";
import ACTION from "../actions/beneficiary";

const initialState = {
  list: [],
  pagination: { limit: 10, start: 0, total: 0, page: 0 },
  query: { name: "", phone: "" },
  aid: {},
  aids: [],
  beneficiary: {},
  tokenBalance: 0,
};

export const BeneficiaryContext = createContext(initialState);
export const BeneficiaryContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(beneficiaryReduce, initialState);

  const issueTokens = async (event, projectId, contractAddress) => {
    const formData = new FormData(event.target);
    let payload = {
      claimable: +formData.get("claimable"),
      phone: +state.beneficiary.phone,
      projectId,
    };
    await AidService.issueBeneficiaryToken(payload, contractAddress);
    let balance = await Service.getBeneficiaryBalance(
      payload.phone,
      contractAddress
    );
    dispatch({ type: ACTION.SET_TOKEN_BALANCE, data: balance });
    return payload;
  };

  async function getBeneficiaryBalance(phone, contract_address) {
    const balance = await Service.getBeneficiaryBalance(
      phone,
      contract_address
    );
    return balance;
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

  function setBeneficiary(b) {
    dispatch({ type: ACTION.SET_BENEFICIARY, data: b });
  }

  const addBeneficiary = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    let payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      govt_id: formData.get("govt_id"),
      email: formData.get("email"),
      address: formData.get("address"),
      wallet_address: formData.get("wallet_address"),
      project_id: formData.get("aid"),
    };
    let d = await Service.addBeneficiary(payload);
    return d;
  };

  function listBeneficiary(params) {
    return new Promise((resolve, reject) => {
      if (!params)
        params = {
          ...state.pagination,
          aid: state.aid,
          ...state.query,
        };

      if (!params.aid) {
        setAid(null);
        Service.listBeneficiary(params).then((d) => {
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
      } else {
        setAid({ _id: params.aid });
        Service.listByAid(params.aid, params).then((d) => {
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
      }
    });
  }

  const importBeneficiary = async () => {
    let beneficiaries = await Service.importBeneficiary({});
    for (let b of beneficiaries) await Service.addBeneficiary(b);
  };

  async function getBeneficiaryDetails(id) {
    let data = await Service.get(id);
    setBeneficiary(data);
    return data;
  }
  return (
    <BeneficiaryContext.Provider
      value={{
        aid: state.aid,
        aids: state.aids,
        list: state.list,
        query: state.query,
        pagination: state.pagination,
        tokenBalance: state.tokenBalance,
        beneficiary_detail: state.beneficiary,
        clear,
        setAid,
        listAid,
        issueTokens,
        addBeneficiary,
        setBeneficiary,
        listBeneficiary,
        importBeneficiary,
        getBeneficiaryDetails,
        getBeneficiaryBalance,
      }}
    >
      {children}
    </BeneficiaryContext.Provider>
  );
};
