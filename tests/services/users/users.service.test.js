import axios from 'axios';
import API from '../../../src/constants/api';
import 'regenerator-runtime/runtime';
import {
	dashboardStats,
	verifyToken,
	signUp,
	loginUsingMetamask,
	checkExistingUser,
	listUsers,
	listUsersByRole,
	getUserById,
	updateUser,
	// updateRole,
	addUser
	// saveRoleToBlockchain
} from '../../../src/services/users';
// import { getEth } from '../../../src/services/vendor';

jest.mock('axios');

describe('Users api calls', () => {
	it('dashboard stats', async () => {
		// const response = {
		// 	data: {}
		// };
		try {
			await dashboardStats();
			// SUCCESS TEST CASES
			expect(axios.get).toHaveBeenCalled();
			expect(axios.get).toHaveBeenCalledWith(`${API.APP}/dashboards`, { headers: { access_token: null } });
		} catch {}
	});
	it('verify token', async () => {
		const token = 'xcvb12';
		const response = {
			data: {
				permissions: '',
				user: ''
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await verifyToken(token);

		// SUCCESS TEST CASES
		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${API.TOKEN_AUTH}?access_token=${token}`);

		// FAIL TEST CASES
		verifyToken().catch(e => {
			// FAIL: if no response is returned when calling verifyToken API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('Sign up', async () => {
		const payload = {};
		const response = {
			data: {
				name: 'spiderman',
				phone: '1231231232'
			}
		};
		axios.post.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await signUp(payload);

		// SUCCESS TEST CASES
		expect(axios.post).toHaveBeenCalled();
		expect(axios.post).toHaveBeenCalledWith(`${API.USERS}/register`, payload);

		// FAIL TEST CASES
		signUp().catch(e => {
			// FAIL: if no response is returned when calling signUp API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('Login using metamask', async () => {
		const payload = {};
		const response = {
			data: {
				name: 'spiderman',
				phone: '1231231232'
			}
		};
		axios.post.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await loginUsingMetamask(payload);

		// SUCCESS TEST CASES
		expect(axios.post).toHaveBeenCalled();
		expect(axios.post).toHaveBeenCalledWith(`${API.METAMASK_LOGIN}`, payload);

		// FAIL TEST CASES
		loginUsingMetamask().catch(e => {
			// FAIL: if no response is returned when calling login Using Metamask API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('Check existing user', async () => {
		const payload = {};
		const response = {
			data: {
				name: 'spiderman',
				phone: '1231231232'
			}
		};
		axios.post.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await checkExistingUser(payload);

		// SUCCESS TEST CASES
		expect(axios.post).toHaveBeenCalled();
		expect(axios.post).toHaveBeenCalledWith(`${API.USERS}/check`, payload, { headers: { access_token: null } });

		// FAIL TEST CASES
		checkExistingUser().catch(e => {
			// FAIL: if no response is returned when calling check Existing User API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('list users', async () => {
		const params = {
			hideMobilizers: true
		};
		const response = {
			data: {
				name: 'spiderman',
				phone: '1231231232'
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		try {
			await listUsers(params);
			// SUCCESS TEST CASES
			expect(axios.get).toHaveBeenCalled();
			expect(axios.get).toHaveBeenCalledWith(`${API.USERS}`, params, { headers: { access_token: null } });
		} catch (e) {}
	});
	it('list users by role', async () => {
		const role = 'Admin';
		const response = {
			data: {
				name: 'spiderman',
				phone: '1231231232'
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		try {
			await listUsersByRole(role);
			// SUCCESS TEST CASES
			expect(axios.get).toHaveBeenCalled();
			expect(axios.get).toHaveBeenCalledWith(`${API.USERS}/roles/${role}`, { headers: { access_token: null } });
		} catch (e) {}
	});
	it('Get user by Id', async () => {
		const userId = 'xcvbnm';
		const response = {
			data: {
				name: 'spiderman',
				phone: '1231231232'
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		try {
			await getUserById(userId);
			// SUCCESS TEST CASES
			expect(axios.get).toHaveBeenCalled();
			expect(axios.get).toHaveBeenCalledWith(`${API.USERS}/${userId}`, { headers: { access_token: null } });
		} catch (e) {}
	});
	it('Update user', async () => {
		const userId = 'xcvbnm';
		const payload = {};
		const response = {
			data: {
				name: 'spiderman',
				phone: '1231231232'
			}
		};
		axios.post.mockResolvedValueOnce(response).mockRejectedValueOnce();

		await updateUser(userId, payload);
		// SUCCESS TEST CASES
		expect(axios.post).toHaveBeenCalled();
		expect(axios.post).toHaveBeenCalledWith(`${API.USERS}/${userId}`, payload, { headers: { access_token: null } });
		updateUser().catch(e => {
			// FAIL TEST CASES
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	// it('Update role', async () => {
	// 	const userId = '5ff99ccbc00c1432b1ecd903';
	// 	const rahat = '';
	// 	const rahat_admin = '';
	// 	const wallet = '';
	// 	const payload = {
	// 		wallet_address: '0xf40db93d8eedd339ca8ce4ebc9da7d8bd0e61d4b',
	// 		role: 'Admin'
	// 	};
	// 	const response = {
	// 		data: {
	// 			roles: ['Admin']
	// 		}
	// 	};
	// 	const address = payload.wallet_address;
	// 	axios.patch.mockResolvedValueOnce(response).mockRejectedValueOnce();
	// 	try {
	// 		await updateRole({ userId, payload, rahat, rahat_admin, wallet });
	// 		await getEth({ address });
	// 		// SUCCESS TEST CASES
	// 		expect(axios.patch).toHaveBeenCalled();
	// 		expect(axios.patch).toHaveBeenCalledWith(
	// 			`${API.USERS}/${userId}/roles`,
	// 			{ data: { roles: ['Admin'] } },
	// 			{
	// 				headers: { access_token: null }
	// 			}
	// 		);
	// 	} catch (e) {}
	// });
	it('Add user', async () => {
		const rahat = '';
		const rahat_admin = '';
		const wallet = '';
		const payload = {
			wallet_address: '0xf40db93d8eedd339ca8ce4ebc9da7d8bd0e61d4b',
			phone: '123456',
			email: 'abc@gmail.com',
			roles: ['Admin']
		};
		const response = {
			data: {
				wallet_address: '0xf40db93d8eedd339ca8ce4ebc9da7d8bd0e61d4b',
				phone: '123456',
				email: 'abc@gmail.com',
				roles: ['Admin']
			}
		};
		// const address = payload.wallet_address;
		axios.post.mockResolvedValueOnce(response).mockRejectedValueOnce();
		try {
			await addUser({ payload, rahat, rahat_admin, wallet });
			// await getEth({ address });
			// SUCCESS TEST CASES
			expect(axios.post).toHaveBeenCalled();
			expect(axios.post).toHaveBeenCalledWith(
				`${API.USERS}`,
				{ data: payload },
				{
					headers: { access_token: null }
				}
			);
		} catch (e) {}
	});
	// it('save role to blockchain', async () => {
	// 	const role = 'Admin';
	// 	const rahat = '';
	// 	const rahat_admin = '';
	// 	const wallet = '';
	// 	const wallet_address = '0xf40db93d8eedd339ca8ce4ebc9da7d8bd0e61d4b';

	// 	saveRoleToBlockchain({ role, rahat, rahat_admin, wallet, wallet_address });
	// });
});
