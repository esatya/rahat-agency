import axios from 'axios';
import {ethers} from 'ethers';
import API from '../constants/api';
import { getUserToken } from '../utils/sessionManager';
import CONTRACT from '../constants/contracts';
import { getContractByProvider,generateMultiCallData } from '../blockchain/abi';
import { calculateTotalPackageBalance } from './aid';

const abiCoder = new ethers.utils.AbiCoder();
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

export async function getVendorsBalances(contract_address, vendorAddresses) {
	const contract  = await getContractByProvider(contract_address,CONTRACT.RAHAT_ERC20);
	const callData = vendorAddresses.map((address) => generateMultiCallData(CONTRACT.RAHAT_ERC20,"balanceOf",[address]))
	const data = await contract.callStatic.multicall(callData);
    const decodedData = data.map((el) => abiCoder.decode(['uint256'],el));
	const vendorBalances = decodedData.map((el) => el[0].toNumber());
	return vendorBalances
}

export async function getTotalVendorsBalances(contract_address,vendorAddresses){
	const balances = await getVendorsBalances(contract_address,vendorAddresses);
	return balances.reduce((prev,curr) => prev+curr,0);
}

export async function getVendorPackageBalance(contract_address, wallet_addresses, tokenIds) {
	const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT_ERC1155);
	const data = await contract.balanceOfBatch(wallet_addresses, tokenIds);
	if (!data) return null;
	const tokenQtys = data.map(d => d.toNumber());
	return calculateTotalPackageBalance({ tokenIds, tokenQtys });
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
		throw Error(e);
	}
}

export async function getTokenIdsByProjects(projects) {
	try {
		const res = await axios.post(
			`${API.NFT}/fetch-project-tokens/`,
			{ projects },
			{
				headers: { access_token: access_token }
			}
		);
		return res.data;
	} catch {}
}

export async function changeVendorStaus(vendorId, status) {
	try {
		return axios.patch(
			`${API.VENDORS}/${vendorId}/status/`,
			{ status: status },
			{
				headers: { access_token: access_token }
			}
		);
	} catch {}
}

export async function list(params) {
	try {
		const res = await axios({
			url: API.VENDORS,
			method: 'get',
			headers: {
				access_token
			},
			params
		});
		return res.data;
	} catch {}
}

export async function get(id) {
	try {
		const res = await axios({
			url: API.VENDORS + '/' + id,
			method: 'get',
			headers: {
				access_token
			}
		});
		return res.data;
	} catch {}
}

export async function vendorTransactions(vendorId) {
	try {
		const res = await axios({
			url: `${API.VENDORS}/${vendorId}/transactions`,
			method: 'get',
			headers: { access_token }
		});
		return res.data;
	} catch {}
}

export async function vendorPackagetx(vendorId) {
	try {
		const res = await axios({
			url: `${API.VENDORS}/${vendorId}/tx/packages`,
			method: 'get',
			headers: { access_token }
		});
		return res.data;
	} catch {}
}

export async function listByAid(aid, params) {
	try {
		const res = await axios({
			url: API.VENDORS + `/aid/${aid}/vendor`,
			method: 'get',
			headers: {
				access_token
			},
			params
		});
		return res.data;
	} catch {}
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
			.catch(() => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}

export async function updateVendor(id, body) {
	try {
		const res = await axios({
			url: `${API.VENDORS}/${id}`,
			method: 'put',
			headers: {
				access_token
			},
			data: body
		});

		return res.data;
	} catch {}
}

export async function approve({ vendorId }) {
	try {
		const res = await axios({
			url: API.VENDORS + `/approve`,
			method: 'post',
			headers: {
				access_token
			},
			data: { vendorId }
		});
		return res.data;
	} catch {}
}

export async function addVendorToProject(vendorId, projectId) {
	try {
		const res = await axios({
			url: `${API.VENDORS}/${vendorId}/add-to-project`,
			method: 'post',
			headers: {
				access_token
			},
			data: { projectId }
		});
		return res.data;
	} catch {}
}

export async function getEth({ address }) {
	try {
		const res = await axios({
			url: API.FAUCET,
			method: 'post',
			data: { address, token: faucet_auth_token }
		});

		return res.data;
	} catch {}
}

export async function getVendorReport(params) {
	const { data } = await axios({
		url: API.VENDORS + `/reports`,
		method: 'get',
		headers: { access_token },
		params
	});
	return data;
}
