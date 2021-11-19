import axios from 'axios';

import API from '../constants/api';
import { getUserToken } from '../utils/sessionManager';
import CONTRACT from '../constants/contracts';
import { getContractByProvider } from '../blockchain/abi';

const access_token = getUserToken();
const faucet_auth_token = process.env.REACT_APP_BLOCKCHAIN_FAUCET_AUTH_TOKEN;

const mapTestContract = contract => ({
	addVendor: contract.addVendor,
	balanceOf: contract.balanceOf
});

export async function getVendorBalance(contract_address, wallet_addr) {
	const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT_ERC20);
	const myContract = mapTestContract(contract);
	const data = await myContract.balanceOf(wallet_addr);
	if (!data) return null;
	return data.toNumber();
}

export async function approveVendor(wallet, payload, contract_address) {
	try {
		const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
		const signerContract = contract.connect(wallet);
		const myContract = mapTestContract(signerContract);
		const data = await myContract.addVendor(payload.wallet_address);
		if (!data) return 'Vendor approve failed!';
		const res = await changeVendorStaus(payload.vendorId, payload.status);
		getEth({ address: payload.wallet_address });
		return res;
	} catch (e) {
		console.log(e);
		throw Error(e);
	}
}

export async function changeVendorStaus(vendorId, status) {
	return axios.patch(
		`${API.VENDORS}/${vendorId}/status/`,
		{ status: status },
		{
			headers: { access_token: access_token }
		}
	);
}

export async function list(params) {
	const res = await axios({
		url: API.VENDORS,
		method: 'get',
		headers: {
			access_token
		},
		params
	});
	return res.data;
}

export async function get(id) {
	const res = await axios({
		url: API.VENDORS + '/' + id,
		method: 'get',
		headers: {
			access_token
		}
	});
	return res.data;
}

export async function vendorTransactions(vendorId) {
	const res = await axios({
		url: `${API.VENDORS}/${vendorId}/transactions`,
		method: 'get',
		headers: { access_token }
	});
	return res.data;
}

export async function listByAid(aid, params) {
	const res = await axios({
		url: API.VENDORS + `/aid/${aid}/vendor`,
		method: 'get',
		headers: {
			access_token
		},
		params
	});
	return res.data;
}

export function add(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(`${API.VENDORS}`, payload, {
				headers: { access_token: access_token }
			})
			.then(res => {
				if (res.statusText === 'OK') {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(err => {
				reject(err);
			});
	});
}

export async function updateVendor(id, body) {
	const res = await axios({
		url: `${API.VENDORS}/${id}`,
		method: 'put',
		headers: {
			access_token
		},
		data: body
	});

	return res.data;
}

export async function approve({ vendorId }) {
	const res = await axios({
		url: API.VENDORS + `/approve`,
		method: 'post',
		headers: {
			access_token
		},
		data: { vendorId }
	});

	return res.data;
}

export async function getEth({ address }) {
	const res = await axios({
		url: API.FAUCET,
		method: 'post',
		data: { address, token: faucet_auth_token }
	});

	return res.data;
}
