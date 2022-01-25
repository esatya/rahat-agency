import { list, issue } from '../../../src/services/onboard';
import axios from 'axios';
import API from '../../../src/constants/api';
import 'regenerator-runtime/runtime';

jest.mock('axios');

describe('Onboard api calls', () => {
	it('list all onboard', async () => {
		const params = {};
		const response = {
			// statusText: 'OK',
			data: {
				name: 'Rice Killer',
				phone: '9999'
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await list(params);

		// SUCCESS TEST CASES
		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${API.ONBOARD}`, params, {
			headers: { access_token: null }
		});

		// FAIL TEST CASES
		list().catch(e => {
			// FAIL: if no response is returned when calling get API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('issue all onboard', async () => {
		const body = {};
		const id = 'assd';
		const response = {
			// statusText: 'OK',
			data: {
				name: 'Rice Killer',
				phone: '9999'
			}
		};
		axios.patch.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await issue(id, body);

		// SUCCESS TEST CASES
		expect(axios.patch).toHaveBeenCalled();
		expect(axios.patch).toHaveBeenCalledWith(
			`${API.ONBOARD}/me`,
			{ data: body },
			{
				headers: { access_token: null }
			}
		);

		// FAIL TEST CASES
		issue().catch(e => {
			// FAIL: if no response is returned when calling patch API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
});
