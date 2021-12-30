import axios from 'axios';
import * as API_CALLS from '../../../src/services/appSettings';
import API from '../../../src/constants/api';
import 'regenerator-runtime/runtime';
jest.mock('axios');

describe('App settings api calls', () => {
	it('Get settings', async () => {
		const response = {
			data: {
				_id: '5ff99ccbc00c1432b1ecd902',
				name: 'eSatya',
				phone: '1231231232',
				email: 'esatya@gmail.com',
				address: 'kupondole'
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		const GetSettings = await API_CALLS.getSettings();

		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${API.APP}/settings`);
		expect(GetSettings).toMatchObject(response.data);

		// FAIL TEST CASES
		API_CALLS.getSettings().catch(e => {
			// FAIL: if no response is returned when calling getSetting API.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('Set kobotoolbox', async () => {
		const response = {
			data: {}
		};
		const payload = {};
		axios.put.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await API_CALLS.setKobotoolbox(payload);

		expect(axios.put).toHaveBeenCalled();
		expect(axios.put).toHaveBeenCalledWith(
			`${API.APP}/kobotoolbox/setup`,
			{ data: payload },
			{ headers: { access_token: null } }
		);

		// FAIL TEST CASES
		API_CALLS.setKobotoolbox().catch(e => {
			// FAIL: if no payload is provided.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
	it('Get kobotoolbox forms', async () => {
		const response = {
			data: {
				labels: ['name', 'address', 'phone'],
				_id: '615a69bd18b3c0d3161a5bab',
				asset_id: 'a7sSTN4tc2p3dsAzg4Uaew',
				asset_name: 'Beneficiary Onboard'
			}
		};
		const query = {};
		axios.get.mockResolvedValue(response);
		await API_CALLS.getKobotoolboxForms(query);

		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${API.APP}/kobotoolbox`, {
			headers: {
				access_token: null
			},
			query
		});
	});
	it('Get kobo forms data', async () => {
		const response = {
			data: {
				_id: 227292109,
				name: 'Monica Green',
				address: 'Central Perk',
				phone: '98838832'
			}
		};
		const assetId = '123';
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		await API_CALLS.getKoboFormsData(assetId);

		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${API.APP}/kobotoolbox/${assetId}`, {
			headers: {
				access_token: null
			}
		});

		// FAIL TEST CASES
		API_CALLS.getKoboFormsData().catch(e => {
			// FAIL: if no asset Id is provided.
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
});
