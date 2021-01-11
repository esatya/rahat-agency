import axios from "axios";

import API from "../constants/api";
import { getUserToken } from "../utils/sessionManager";
import CONTRACT from "../constants/contracts";
import { getContract } from "../blockchain/abi";

const access_token = getUserToken();

const mapTestContract = (contract) => ({
  addVendor: contract.addVendor,
  balanceOf: contract.balanceOf,
});

export async function getVendorBalance(contract_address, wallet_addr) {
  const contract = await getContract(contract_address, CONTRACT.AIDTOKEN);
  const myContract = mapTestContract(contract);
  const data = await myContract.balanceOf(wallet_addr);
  if (!data) return "Vendor not found!";
  return data.toNumber();
}

export async function approveVendor(vendorId, payload) {
  const contract = await getContract(payload.contract_address, CONTRACT.RAHAT);
  const myContract = mapTestContract(contract);
  const data = await myContract.addVendor(payload.wallet_address);
  if (!data) return "Vendor approve failed!";
  const res = await changeVendorStaus(vendorId, payload.status);
  return res;
}

export async function changeVendorStaus(vendorId, status) {
  return axios.patch(
    `${API.VENDORS}/${vendorId}/status/`,
    { status: status },
    {
      headers: { access_token: access_token },
    }
  );
}

export async function list(params) {
  const res = await axios({
    url: API.VENDORS,
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
    url: API.VENDORS + "/" + id,
    method: "get",
    headers: {
      access_token,
    },
  });
  return res.data;
}

export async function vendorTransactions(vendorId) {
  const res = await axios({
    url: `${API.VENDORS}/${vendorId}/transactions`,
    method: "get",
    headers: { access_token },
  });
  return res.data;
}

export async function listByAid(aid, params) {
  const res = await axios({
    url: API.VENDORS + `/aid/${aid}/vendor`,
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
      .post(`${API.VENDORS}`, payload, {
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

export async function approve({ vendorId }) {
  const res = await axios({
    url: API.VENDORS + `/approve`,
    method: "post",
    headers: {
      access_token,
    },
    data: { vendorId },
  });

  return res.data;
}
