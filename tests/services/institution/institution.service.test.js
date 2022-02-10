import axios from 'axios';
import { get, list, add, update } from '../../../src/services/institution';
import API from '../../../src/constants/api';
import 'regenerator-runtime/runtime';
import qs from 'query-string';

jest.mock('axios');

describe('Institution api calls', () => {
	it('get the institutions', async () => {
		const institutionId = 'axde23';
		const response = {
			statusText: 'OK',
			data: {
				name: 'Rice Killer',
				phone: '9999'
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await get(institutionId);

		// SUCCESS TEST CASES
		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${API.INSTITUTIONS}/${institutionId}`, {
			headers: { access_token: null }
		});

		// FAIL TEST CASES
		get().catch(e => {
			// FAIL: if no response is returned when calling get API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('list the institutions', async () => {
		const query = {};
		const response = {
			statusText: 'OK',
			data: {
				name: 'Rice Killer',
				phone: '9999'
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await list(query);

		// SUCCESS TEST CASES
		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${API.INSTITUTIONS}?${qs.stringify(query)}`, {
			headers: { access_token: null }
		});

		// FAIL TEST CASES
		list().catch(e => {
			// FAIL: if no response is returned when calling list API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('Add the institutions', async () => {
		const payload = {};
		const response = {
			statusText: 'OK',
			data: {
				name: 'Rice Killer',
				phone: '9999'
			}
		};
		axios.post.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await add(payload);

		// SUCCESS TEST CASES
		expect(axios.post).toHaveBeenCalled();
		expect(axios.post).toHaveBeenCalledWith(`${API.INSTITUTIONS}`, payload, {
			headers: { access_token: null }
		});

		// FAIL TEST CASES
		add().catch(e => {
			// FAIL: if no response is returned when calling add API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('update the institution', async () => {
		const institutionId = 'xcvbn';
		const payload = {};
		const response = {
			statusText: 'OK',
			data: {
				name: 'Rice Killer',
				phone: '9999'
			}
		};
		// const res = {
		// 	data: {
		// 		name: 'Rice Killer',
		// 		phone: '9999'
		// 	}
		// };
		axios.put.mockResolvedValueOnce(response).mockRejectedValueOnce();
		const updateInstitution = await update(institutionId, payload);

		//SUCCESS TEST CASE
		expect(axios.put).toHaveBeenCalled();
		expect(axios.put).toHaveBeenCalledWith(`${API.BANK}/${institutionId}`, payload);
		expect(updateInstitution).toMatchObject(response.data);

		//FAILURE TEST CASE
		update().catch(e => {
			//FAIL: if no response is returned when calling update API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
});
