import axios from "axios";

import { getUserToken } from "../utils/sessionManager";
import API from "../constants/api";
import CONTRACT from "../constants/contracts";
import { getContractByProvider } from "../blockchain/abi";
const access_token = getUserToken();

const mapTestContract = (contract) => ({
  tokenBalance: contract.tokenBalance,
});

export async function getBeneficiaryBalance(phone, contract_address) {
  const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
  const myContract = mapTestContract(contract);
  const data = await myContract.tokenBalance(phone);
  if (!data) return "No balance!";
  return data.toNumber();
  }

export async function listBeneficiary(params) {
  const res = await axios({
    url: API.BENEFICARIES,
    method: "get",
    headers: {
      access_token,
    },
    params,
  });
  return res.data;
}

export async function get(id) {
  const res = await axios({
    url: API.BENEFICARIES + "/" + id,
    method: "get",
    headers: {
      access_token,
    },
  });
  return res.data;
}

export async function listByAid(aid, params) {
  const res = await axios({
    url: API.PROJECTS + `/${aid}/beneficiaries`,
    method: "get",
    headers: {
      access_token,
    },
    params,
  });
  return res.data;
}

export async function addBeneficiary(body) {
  const res = await axios({
    url: API.BENEFICARIES,
    method: "post",
    headers: {
      access_token,
    },
    data: body,
  });

  return res.data;
}

export async function importBeneficiary(body) {
  const { data } = await axios({
    url: API.BENEFICARIES + `/import`,
    method: "post",
    headers: {
      access_token,
    },
    data: body,
  });
  return data;
}
