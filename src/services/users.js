import API from '../constants/api';
import axios from 'axios';
import { saveUser, saveUserToken, saveUserPermissions, getUserToken } from '../utils/sessionManager';
import CONTRACT from '../constants/contracts';
import { getContractByProvider } from '../blockchain/abi';
import { ROLES } from '../constants';
import { getEth } from './vendor';

const access_token = getUserToken();

const mapContractToMethod = contract => ({
	addOwner: contract.addOwner,
	addAdmin: contract.addAdmin
});

export async function dashboardStats() {
	try {
		let res = await axios.get(`${API.APP}/dashboards`, {
			headers: { access_token }
		});
		return res.data;
	} catch {}
}

export function verifyToken(token) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.TOKEN_AUTH}?access_token=${token}`)
			.then(res => {
				if (res.data && res.data.user) {
					saveUser(res.data.user);
					saveUserToken(token);
					saveUserPermissions(res.data.permissions);
					resolve({ sucess: true, status: 200 });
				}
				resolve({
					success: false,
					status: 500
				});
			})
			.catch(err => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}

export function signUp(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(`${API.USERS}/register`, payload)
			.then(res => {
				if (res) {
					resolve({ sucess: true, status: 200 });
				}
				resolve({
					success: false,
					status: 500
				});
			})
			.catch(err => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}

export function loginUsingMetamask(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(API.METAMASK_LOGIN, payload)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}

export function checkExistingUser(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(`${API.USERS}/check`, payload, { headers: { access_token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}

export async function listUsers(params) {
	try {
		params.hideMobilizers = true;
		const res = await axios({
			url: `${API.USERS}`,
			method: 'Get',
			headers: {
				access_token
			},
			params
		});
		return res.data;
	} catch {}
}

export async function listUsersByRole(role) {
	try {
		const res = await axios({
			url: `${API.USERS}/roles/${role}`,
			method: 'Get',
			headers: {
				access_token
			}
		});
		return res.data;
	} catch {}
}

export async function getUserById(userId) {
	try {
		const res = await axios({
			url: `${API.USERS}/${userId}`,
			method: 'Get',
			headers: {
				access_token
			}
		});
		return res.data;
	} catch {}
}

export async function updateUser(userId, payload) {
	delete payload.wallet_address;
	return new Promise((resolve, reject) => {
		axios
			.post(`${API.USERS}/${userId}`, payload, { headers: { access_token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(() => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}

export async function updateRole({ userId, payload, rahat, rahat_admin, wallet }) {
	try {
		const { wallet_address, role } = payload;
		const b_user = await saveRoleToBlockchain({
			role: role,
			rahat,
			rahat_admin,
			wallet,
			wallet_address: wallet_address
		});
		if (b_user) {
			await getEth({ address: wallet_address });
			const res = await axios({
				url: `${API.USERS}/${userId}/roles`,
				method: 'Patch',
				data: { roles: [role] },
				headers: { access_token }
			});
			return res.data;
		}
	} catch (err) {
		throw err;
	}
}

export async function deleteRole({ userId, role }) {
	const res = await axios({
		url: `${API.USERS}/${userId}/roles`,
		method: 'Delete',
		headers: { access_token },
		data: { role }
	});
	return res.data;
}

export async function addUser({ payload, rahat, rahat_admin, wallet }) {
	try {
		const { phone, email, wallet_address } = payload;
		await checkExistingUser({ phone, email, wallet_address });
		const b_user = await saveRoleToBlockchain({
			role: payload.roles[0],
			rahat,
			rahat_admin,
			wallet,
			wallet_address: payload.wallet_address
		});
		if (b_user) {
			await getEth({ address: wallet_address });
			const res = await axios({
				url: API.USERS,
				method: 'Post',
				data: payload,
				headers: { access_token }
			});
			return res.data;
		}
	} catch (err) {
		throw err;
	}
}

async function saveRoleToBlockchain({ role, rahat, rahat_admin, wallet, wallet_address }) {
	const admin_contract = await getContractByProvider(rahat_admin, CONTRACT.RAHATADMIN);
	const rahat_contract = await getContractByProvider(rahat, CONTRACT.RAHAT);
	if (role === ROLES.MANAGER) {
		const signed_contract = rahat_contract.connect(wallet);
		const my_contract = mapContractToMethod(signed_contract);
		return my_contract.addAdmin(wallet_address);
	}
	if (role === ROLES.ADMIN) {
		const sign_admin_contract = admin_contract.connect(wallet);
		const sign_rahat_contract = rahat_contract.connect(wallet);
		const my_admin_contract = mapContractToMethod(sign_admin_contract);
		const my_rahat_contract = mapContractToMethod(sign_rahat_contract);
		await my_rahat_contract.addAdmin(wallet_address);
		return my_admin_contract.addOwner(wallet_address);
	}
}
