import axios from 'axios';
import API from '../../../src/constants/api';
import 'regenerator-runtime/runtime';
import {
	getVendorBalance,
	approveVendor,
	getTokenIdsByProjects,
	changeVendorStaus,
	list,
	get,
	vendorTransactions,
	listByAid,
	add,
	updateVendor,
	approve,
	addVendorToProject,
	getEth
} from '../../../src/services/vendor';

jest.mock('axios');

describe('Vendor api calls', () => {
	it('get vendor balance', async () => {
		const contract_address = '';
		const wallet_addr = '0x8fca06c557987976a2da2c1eb5d1e3cb126c3479';
		try {
			const getBalance = await getVendorBalance(contract_address, wallet_addr);
			expect(getBalance).toHaveBeenCalled();
		} catch {}
	});
	it('approve vendor', async () => {
		const contract_address = '';
		const wallet = '';
		const payload = {};
		try {
			const ApproveVendor = await approveVendor(wallet, payload, contract_address);
			expect(ApproveVendor).toHaveBeenCalled();
		} catch {}
	});
	it('get token Ids by projects', async () => {
		const projects = {};
		const response = {
			data: {
				name: 'spiderman',
				phone: '324703829',
				email: 'masdnf@gmail.com'
			}
		};
		try {
			axios.post.mockResolvedValueOnce(response);
			const getToken = await getTokenIdsByProjects(projects);

			//SUCCESS CASE
			expect(axios.post).toHaveBeenCalled();
			expect(axios.post).toHaveBeenCalledWith(
				`${API.NFT}/fetch-project-tokens/`,
				{ projects },
				{
					headers: { access_token: null }
				}
			);
			expect(getToken).toMatchObject(response.data);
		} catch {}
	});
	it('change vendor status', async () => {
		const vendorId = 'df34';
		const status = {};
		const response = {
			data: {}
		};
		try {
			axios.patch.mockResolvedValueOnce(response);
			await changeVendorStaus(vendorId, status);

			//SUCCESS CASE
			expect(axios.patch).toHaveBeenCalled();
			expect(axios.patch).toHaveBeenCalledWith(
				`${API.VENDORS}/${vendorId}/status/`,
				{ status: status },
				{
					headers: { access_token: null }
				}
			);
		} catch {}
	});
	it('list vendors', async () => {
		const params = {};
		const response = {
			data: {}
		};
		try {
			axios.get.mockResolvedValueOnce(response);
			await list(params);
			//SUCCESS CASE
			expect(axios.get).toHaveBeenCalled();
			expect(axios.get).toHaveBeenCalledWith(`${API.VENDORS}`, params, {
				headers: { access_token: null }
			});
		} catch {}
	});
	it('get vendors', async () => {
		const id = 'df34';
		const response = {
			data: {}
		};
		try {
			axios.get.mockResolvedValueOnce(response);
			await get(id);
			//SUCCESS CASE
			expect(axios.get).toHaveBeenCalled();
			expect(axios.get).toHaveBeenCalledWith(`${API.VENDORS}/${id}`, {
				headers: { access_token: null }
			});
		} catch {}
	});
	it('vendor transactions', async () => {
		const vendorId = 'df34';
		const response = {
			data: {}
		};
		try {
			axios.get.mockResolvedValueOnce(response);
			await vendorTransactions(vendorId);
			//SUCCESS CASE
			expect(axios.get).toHaveBeenCalled();
			expect(axios.get).toHaveBeenCalledWith(`${API.VENDORS}/${vendorId}/transactions`, {
				headers: { access_token: null }
			});
		} catch {}
	});
	it('list vendors by aid', async () => {
		const params = {};
		const aid = 'earthquake relief';
		const response = {
			data: {}
		};
		try {
			axios.get.mockResolvedValueOnce(response);
			await listByAid(aid, params);
			//SUCCESS CASE
			expect(axios.get).toHaveBeenCalled();
			expect(axios.get).toHaveBeenCalledWith(`${API.VENDORS}/aid/${aid}/vendor`, params, {
				headers: { access_token: null }
			});
		} catch {}
	});
	it('add vendors', async () => {
		const payload = {};
		const response = {
			statusText: 'OK',
			data: {}
		};

		axios.post.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await add(payload);
		//SUCCESS CASE
		expect(axios.post).toHaveBeenCalled();
		expect(axios.post).toHaveBeenCalledWith(`${API.VENDORS}`, payload, {
			headers: { access_token: null }
		});
		//FAILURE CASE
		add().catch(e => {
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('update vendors', async () => {
		const body = {};
		const id = 'sd2345';
		const response = {
			data: {}
		};
		try {
			axios.put.mockResolvedValueOnce(response);
			await updateVendor(id, body);
			//SUCCESS CASE
			expect(axios.put).toHaveBeenCalled();
			expect(axios.put).toHaveBeenCalledWith(
				`${API.VENDORS}/${id}`,
				{ data: body },
				{
					headers: { access_token: null }
				}
			);
		} catch {}
	});
	it('approve vendors', async () => {
		const vendorId = 'sd2345';
		const response = {
			data: {}
		};
		try {
			axios.post.mockResolvedValueOnce(response);
			await approve({ vendorId });
			//SUCCESS CASE
			expect(axios.post).toHaveBeenCalled();
			expect(axios.post).toHaveBeenCalledWith(
				`${API.VENDORS}/approve`,
				{ data: { vendorId } },
				{
					headers: { access_token: null }
				}
			);
		} catch {}
	});
	it('add vendor to project', async () => {
		const projectId = 'mnbvc';
		const vendorId = 'sd2345';
		const response = {
			data: {}
		};
		try {
			axios.post.mockResolvedValueOnce(response);
			await addVendorToProject(vendorId, projectId);
			//SUCCESS CASE
			expect(axios.post).toHaveBeenCalled();
			expect(axios.post).toHaveBeenCalledWith(
				`${API.VENDORS}/${vendorId}/add-to-project`,
				{ data: { projectId } },
				{
					headers: { access_token: null }
				}
			);
		} catch {}
	});
	it('get ether', async () => {
		const faucet_auth_token = '';
		const address = '';
		const response = {
			data: {
				address: '',
				token: ''
			}
		};
		try {
			axios.post.mockResolvedValueOnce(response);
			await getEth({ address });
			//SUCCESS CASE
			expect(axios.post).toHaveBeenCalled();
			expect(axios.post).toHaveBeenCalledWith(
				`${API.FAUCET}`,
				{ data: { address, token: faucet_auth_token } },
				{
					headers: { access_token: null }
				}
			);
		} catch {}
	});
});
