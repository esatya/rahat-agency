import axios from 'axios';
import * as API_CALLS from '../../../src/services/appSettings';
import API from '../../../src/constants/api';
import 'regenerator-runtime/runtime';

jest.mock('axios');
// const access_token = 'eyJhbGciOi';
// const assetId = '123';

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
		axios.get.mockResolvedValueOnce(response);
		const GetSettings = await API_CALLS.getSettings();
		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${API.APP}/settings`);
		expect(GetSettings).toMatchObject(response.data);
	});
	// it('Set kobotoolbox', async () => {
	// 	const res = {
	// 		data: {}
	// 	};
	// 	const payload = {};
	// 	axios.put.mockResolvedValueOnce(res);
	// 	await API_CALLS.setKobotoolbox(payload);
	// 	expect(axios.put).toHaveBeenCalled();
	// 	expect(axios.put).toHaveBeenCalledWith(`${API.APP}/kobotoolbox/setup`, {
	// 		headers: {
	// 			access_token
	// 		},
	// 		data: payload
	// 	});
	// });
	// it('Get kobotoolbox forms', async () => {
	// 	const res = {
	// 		data: {
	// 			labels: ['name', 'address', 'phone'],
	// 			_id: '615a69bd18b3c0d3161a5bab',
	// 			asset_id: 'a7sSTN4tc2p3dsAzg4Uaew',
	// 			asset_name: 'Beneficiary Onboard'
	// 		}
	// 	};
	// 	const query = {};
	// 	axios.get.mockResolvedValueOnce(res);
	// 	await API_CALLS.getKobotoolboxForms(query);
	// 	expect(axios.get).toHaveBeenCalled();
	// 	expect(axios.get).toHaveBeenCalledWith(`${API.APP}/kobotoolbox`, {
	// 		headers: {
	// 			access_token
	// 		},
	// 		query
	// 	});
	// });
	// it('Get kobo forms data', async () => {
	// 	const response = {
	// 		data: {
	// 			_id: 227292109,
	// 			name: 'Monica Green',
	// 			address: 'Central Perk',
	// 			phone: '98838832'
	// 		}
	// 	};
	// 	axios.get.mockResolvedValueOnce(response);
	// 	await API_CALLS.getKoboFormsData(assetId);
	// 	expect(axios.get).toHaveBeenCalled();
	// 	expect(axios.get).toHaveBeenCalledWith(`${API.APP}/kobotoolbox/${assetId}`, {
	// 		headers: {
	// 			access_token
	// 		}
	// 	});
	// });
});
