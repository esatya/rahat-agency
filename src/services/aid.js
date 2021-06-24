import axios from "axios";
import qs from "query-string";
import {ethers} from "ethers";

import { getUserToken } from "../utils/sessionManager";
import API from "../constants/api";
import CONTRACT from "../constants/contracts";
import { getContract,getContractByProvider } from "../blockchain/abi";

const access_token = getUserToken();

const mapTestContract = (contract) => ({
  setProjectBudget: contract.setProjectBudget,
  projectCapital: contract.projectCapital,
  getProjectBalance: contract.getProjectBalance,
  issueToken: contract.issueToken,
});

export async function addProjectBudget(wallet,aidId, supplyToken, contract_addr) {
  const contract = await getContractByProvider(contract_addr, CONTRACT.RAHATADMIN);
  const signerContract = contract.connect(wallet);
  const myContract = mapTestContract(signerContract);
  const res = await myContract.setProjectBudget(aidId, supplyToken);
  let d = await res.wait();
  if (d) {
    await tokenAllocate(aidId, supplyToken, d.transactionHash);
    let project = await changeProjectStatus(aidId, "active");
    return project;
  }
}



async function tokenAllocate(projectId, tokens, txHash) {
  return axios.patch(
    `${API.PROJECTS}/${projectId}/token`,
    { amount: tokens, txhash: txHash },
    {
      headers: { access_token },
    }
  );
}

export async function issueBeneficiaryToken(payload, contract_addr) {
  const contract = await getContract(contract_addr, CONTRACT.RAHAT);
  const myContract = mapTestContract(contract);
  const res = await myContract.issueToken(
    payload.projectId,
    payload.phone,
    payload.claimable
  );
  let d = await res.wait();
  return d;
}

export async function changeProjectStatus(aidId, status) {
  try {
    let res = await axios.patch(
      `${API.PROJECTS}/${aidId}/status`,
      { status },
      {
        headers: { access_token },
      }
    );
    return res.data;
  } catch {}
}

// Get Project Balance
export async function loadAidBalance(aidId, contract_address) {
  try {
    const hashId = ethers.utils.solidityKeccak256(["string"], [aidId]);
    const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
    const myContract = mapTestContract(contract);
    const data = await myContract.getProjectBalance(hashId);
    return data.toNumber();
  } catch(e) {
    return 0;
  }
}

export async function getProjectCapital(aidId, contract_address) {
  try {
    const hashId = ethers.utils.solidityKeccak256(["string"], [aidId]);
    const contract = await getContractByProvider(contract_address, CONTRACT.RAHATADMIN);
    const myContract = mapTestContract(contract);
    const data = await myContract.projectCapital(hashId);
    return data.toNumber();
  } catch {
    return 0;
  }
}

export function vendorsByAid(aidId, query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API.PROJECTS}/${aidId}/beneficiary?${qs.stringify(query)}`, {
        headers: { access_token: access_token },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          resolve(res.data);
        }
        reject(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function beneficiaryByAid(aidId, query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API.PROJECTS}/${aidId}/beneficiaries?${qs.stringify(query)}`, {
        headers: { access_token: access_token },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          resolve(res.data);
        }
        reject(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getAidDetails(aidId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API.PROJECTS}/${aidId}`, {
        headers: { access_token: access_token },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          resolve(res.data);
        }
        reject(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function addAid(payload) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API.PROJECTS}`, payload, {
        headers: { access_token: access_token },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          resolve(res.data);
        }
        reject(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function listAid(params) {
  let { data } = await axios({
    url: API.PROJECTS,
    method: "get",
    headers: {
      access_token: access_token,
    },
    params,
  });

  return data;
}

export async function addBeneficiary(aid, body) {
  const { data } = await axios({
    url: API.PROJECTS + `/${aid}/beneficiary`,
    method: "post",
    headers: {
      access_token,
    },
    data: body,
  });

  return data;
}

export async function addVendor(aid, body) {
  const { data } = await axios({
    url: API.PROJECTS + `/${aid}/vendor`,
    method: "post",
    headers: {
      access_token,
    },
    data: body,
  });

  return data;
}
