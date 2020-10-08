import React, { createContext, useReducer } from "react";
import beneficiaryReduce from "../reducers/beneficiaryReducer";
import * as Service from "../services/beneficiary";
import * as AidService from "../services/aid";
import ACTION from "../actions/beneficiary";

const initialState = {
  list: [],
  pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
  aid: {},
  projectList: [],
  beneficiary: {},
  tokenBalance: 0,
};

export const BeneficiaryContext = createContext(initialState);
export const BeneficiaryContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(beneficiaryReduce, initialState);

  async function getAvailableBalance(proejctId, rahatAdminContractAddr) {
    return AidService.loadAidBalance(proejctId, rahatAdminContractAddr);
  }

  const issueTokens = async (payload, contractAddress) => {
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
    const d = await AidService.listAid({ start: 0, limit: 50 });
    dispatch({ type: ACTION.LIST_AID, data: { projectList: d.data } });
    return d;
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

  async function listBeneficiary(params) {
    let res = await Service.listBeneficiary(params);
    if (res) {
      dispatch({
        type: ACTION.LIST,
        res,
      });
      return res;
    }
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
        projectList: state.projectList,
        list: state.list,
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
        getAvailableBalance,
        getBeneficiaryDetails,
        getBeneficiaryBalance,
      }}
    >
      {children}
    </BeneficiaryContext.Provider>
  );
};
