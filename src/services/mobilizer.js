import axios from "axios";

import API from "../constants/api";
import { getUserToken } from "../utils/sessionManager";
import CONTRACT from "../constants/contracts";
import { getContractByProvider } from "../blockchain/abi";

const access_token = getUserToken();
const faucet_auth_token = process.env.REACT_APP_BLOCKCHAIN_FAUCET_AUTH_TOKEN;

const mapTestContract = (contract) => ({
  addAdmin: contract.addAdmin,
  balanceOf: contract.balanceOf,
});

export async function getMobilizerBalance(contract_address, wallet_addr) {
  const contract = await getContractByProvider(contract_address, CONTRACT.AIDTOKEN);
  const myContract = mapTestContract(contract);
  const data = await myContract.balanceOf(wallet_addr);
  if (!data) return "Mobilizer not found!";
  return data.toNumber();
}

export async function approveMobilizer(wallet, payload,contract_address) {
  try{
  const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
  const signerContract = contract.connect(wallet);
  const myContract = mapTestContract(signerContract);
  const data = await myContract.addAdmin(payload.wallet_address);
  if (!data) return "Mobilizer approve failed!";
  const res = await changeMobilizerStaus(payload.mobilizerId, payload.status);
  getEth({address:payload.wallet_address});
  return res;
  }
  catch(e){
    console.log(e);
    throw Error(e);
  }
}

export async function changeMobilizerStaus(mobilizerId, status) {
  return axios.patch(
    `${API.MOBILIZERS}/${mobilizerId}/status/`,
    { status: status },
    {
      headers: { access_token: access_token },
    }
  );
}

export async function list(params) {
  console.log("MOBILIXERS")
  const res = await axios({
    url: API.MOBILIZERS,
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
    url: API.MOBILIZERS + "/" + id,
    method: "get",
    headers: {
      access_token,
    },
  });
  return res.data;
}

export async function mobilizerTransactions(mobilizerId) {
  const res = await axios({
    url: `${API.MOBILIZERS}/${mobilizerId}/transactions`,
    method: "get",
    headers: { access_token },
  });
  return res.data;
}

export async function listByAid(aid, params) {
  const res = await axios({
    url: API.MOBILIZERS + `/aid/${aid}/mobilizer`,
    method: "get",
    headers: {
      access_token,
    },
    params,
  });
  return res.data;
}

export function add(payload) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API.MOBILIZERS}`, payload, {
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

export async function approve({ mobilizerId }) {
  const res = await axios({
    url: API.MOBILIZERS + `/approve`,
    method: "post",
    headers: {
      access_token,
    },
    data: { mobilizerId },
  });

  return res.data;
}

export async function getEth({ address }) {
  const res = await axios({
    url: API.FAUCET,
    method: "post",
    data: { address,token:faucet_auth_token },
  });

  return res.data;
}
