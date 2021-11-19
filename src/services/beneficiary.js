import axios from 'axios';

import { getUserToken } from '../utils/sessionManager';
import API from '../constants/api';
import CONTRACT from '../constants/contracts';
import { getContractByProvider } from '../blockchain/abi';
const access_token = getUserToken();

// Available tokens
export async function getBeneficiaryBalance(phone, contract_address) {
	const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
	const data = await contract.erc20Balance(phone);
	if (!data) return null;
	return data.toNumber();
}

// Total tokens
export async function getTotalIssuedTokens(phone, contract_address) {
	const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
	const data = await contract.erc20Issued(phone);
	if (!data) return null;
	return data.toNumber();
}

async function calculateTotalPackageBalance(payload) {
	let res = await axios.post(`${API.NFT}/total-package-balance`, payload, {
		headers: { access_token }
	});
	return res.data;
}

export async function getBeneficiaryPackageBalance(phone, contract_address) {
	const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
	const data = await contract.getTotalERC1155Balance(phone);
	if (!data) return null;
	if (data) {
		const tokenIds = data.tokenIds.map(t => t.toNumber());
		const tokenQtys = data.balances.map(b => b.toNumber());
		return calculateTotalPackageBalance({ tokenIds, tokenQtys });
	}
}

export async function listBeneficiary(params) {
	const res = await axios({
		url: API.BENEFICARIES,
		method: 'get',
		headers: {
			access_token
		},
		params
	});
	return res.data;
}

export async function getById(id) {
	const res = await axios({
		url: API.BENEFICARIES + '/' + id,
		method: 'get',
		headers: {
			access_token
		}
	});
	return res.data;
}

export async function listByAid(aid, params) {
	const res = await axios({
		url: API.PROJECTS + `/${aid}/beneficiaries`,
		method: 'get',
		headers: {
			access_token
		},
		params
	});
	return res.data;
}

export async function addBeneficiary(body) {
	if (!body.wallet_address) body.wallet_address = body.phone;
	const res = await axios({
		url: API.BENEFICARIES,
		method: 'post',
		headers: {
			access_token
		},
		data: body
	});

	return res.data;
}

export async function addBeneficiaryInBulk(body) {
	const res = await axios({
		url: `${API.BENEFICARIES}/bulk`,
		method: 'post',
		headers: {
			access_token
		},
		data: body
	});

	return res.data;
}

export async function updateBeneficiary(id, body) {
	const res = await axios({
		url: `${API.BENEFICARIES}/${id}`,
		method: 'put',
		headers: {
			access_token
		},
		data: body
	});

	return res.data;
}

export async function importBeneficiary(body) {
	const { data } = await axios({
		url: API.BENEFICARIES + `/import`,
		method: 'post',
		headers: {
			access_token
		},
		data: body
	});
	return data;
}
