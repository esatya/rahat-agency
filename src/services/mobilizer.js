import axios from 'axios';
import {ethers} from 'ethers';
import API from '../constants/api';
import { getUserToken } from '../utils/sessionManager';
import CONTRACT from '../constants/contracts';
import { getContractByProvider,generateMultiCallData } from '../blockchain/abi';
import { calculateTotalPackageBalance } from './aid';
import {dashboardStats} from './users';
const abiCoder = new ethers.utils.AbiCoder();
const access_token = getUserToken();
const faucet_auth_token = process.env.REACT_APP_BLOCKCHAIN_FAUCET_AUTH_TOKEN;

// Token balance
export async function getMobilizerBalance(contract_address, wallet_addr) {
	const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
	const data = await contract.erc20IssuedBy(wallet_addr);
	if (!data) return null;
	return data.toNumber();
}

export async function getMobilizersIssuedTokens(contract_address, mobilizerAddresses) {
	const contract  = await getContractByProvider(contract_address,CONTRACT.RAHAT);
	const callData = mobilizerAddresses.map((address) => generateMultiCallData(CONTRACT.RAHAT,"erc20IssuedBy",[address]))
	const data = await contract.callStatic.multicall(callData);
    const decodedData = data.map((el) => abiCoder.decode(['uint256'],el));
	const mobilizerIssuedTokens = decodedData.map((el) => el[0].toNumber());
	return mobilizerIssuedTokens
}

export async function getTotalMobilizerIssuedTokens(contract_address,mobilizerAddresses){
	const {tokenAllocation} = await dashboardStats();
	const moblizerIssuedTokens = await getMobilizersIssuedTokens(contract_address,mobilizerAddresses);
	const totalMobilizerIssuedTokens = moblizerIssuedTokens.reduce((prev,curr) => prev+curr,0);
	return {totalTokens: tokenAllocation.totalAllocation, totalMobilizerIssuedTokens}

}

export async function getMobilizerPackageBalance(contract_address, wallet_addr) {
	const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
	const data = await contract.getTotalERC1155IssuedBy(wallet_addr);
	if (!data) return null;
	if (data) {
		const tokenIds = data.tokenIds.map(t => t.toNumber());
		const tokenQtys = data.balances.map(b => b.toNumber());
		return calculateTotalPackageBalance({ tokenIds, tokenQtys });
	}
}

export async function approveMobilizer(wallet, payload, contract_address) {
	let res = null;
	const { wallet_address, projectId, isActivateOnly, mobilizerId, status } = payload;
	const contract = await getContractByProvider(contract_address, CONTRACT.RAHAT);
	const signerContract = contract.connect(wallet);
	const tx = await signerContract.addMobilizer(wallet_address, projectId);
	await tx.wait();
	// if (!minedTx) return 'Mobilizer approve failed!';
	if (isActivateOnly) res = await changeMobStatusInProject(mobilizerId, { projectId, status });
	else res = await approveMobilizerToProject(wallet_address, projectId);
	getEth({ address: wallet_address });
	return res;
}

export async function changeMobilizerStaus(mobilizerId, status) {
	return axios.patch(
		`${API.MOBILIZERS}/${mobilizerId}/status/`,
		{ status: status },
		{
			headers: { access_token: access_token }
		}
	);
}

export async function changeMobStatusInProject(mobilizerId, payload) {
	return axios.patch(`${API.MOBILIZERS}/${mobilizerId}/project-status/`, payload, {
		headers: { access_token: access_token }
	});
}

export async function approveMobilizerToProject(wallet_address, projectId) {
	return axios.patch(
		`${API.MOBILIZERS}/approve/`,
		{ wallet_address, projectId },
		{
			headers: { access_token: access_token }
		}
	);
}

export async function list(params) {
	const res = await axios({
		url: API.MOBILIZERS,
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
		url: API.MOBILIZERS + '/' + id,
		method: 'get',
		headers: {
			access_token
		}
	});
	return res.data;
}

export async function mobilizerTransactions(mobilizerId) {
	const res = await axios({
		url: `${API.MOBILIZERS}/${mobilizerId}/transactions`,
		method: 'get',
		headers: { access_token }
	});
	return res.data;
}

export async function listByAid(aid, params) {
	const res = await axios({
		url: API.MOBILIZERS + `/aid/${aid}/mobilizer`,
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
			.post(`${API.MOBILIZERS}`, payload, {
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

export async function updateMobilizer(id, body) {
	const res = await axios({
		url: `${API.MOBILIZERS}/${id}`,
		method: 'put',
		headers: {
			access_token
		},
		data: body
	});

	return res.data;
}

export async function approve({ mobilizerId }) {
	const res = await axios({
		url: API.MOBILIZERS + `/approve`,
		method: 'post',
		headers: {
			access_token
		},
		data: { mobilizerId }
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

export async function getMobilizerReport(params) {
	const { data } = await axios({
		url: API.MOBILIZERS + `/reports`,
		method: 'get',
		headers: { access_token },
		params
	});
	return data;
}
