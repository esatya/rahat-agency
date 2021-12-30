import axios from 'axios';
import { deployAgencyToken, getAgencyDetails, listAgency, approveAgency } from '../../../src/services/agency';
import API from '../../../src/constants/api';
import 'regenerator-runtime/runtime';
import qs from 'query-string';

jest.mock('axios');

const agencyId = '5ff99ccbc00c1432b1ecd902';
const access_token = null;

describe('Agency api calls', () => {
	it('Deploy agency token', async () => {
		const response = {
			statusText: 'OK',
			data: {
				_id: '5ff99ccbc00c1432b1ecd902',
				name: 'eSatya',
				phone: '1231231232',
				email: 'esatya@gmail.com',
				address: 'kupondole'
			}
		};
		const payload = {
			name: 'eSatya',
			phone: '1231231232',
			email: 'esatya@gmail.com'
		};
		axios.post.mockResolvedValueOnce(response).mockRejectedValueOnce();
		const DeployAgencyToken = await deployAgencyToken(agencyId, payload);

		// SUCCESS: must send api, headers, payload and id while calling deployAgencyToken API.
		expect(axios.post).toHaveBeenCalledWith(`${API.AGENCY}/${agencyId}/token`, payload, {
			headers: { access_token: access_token }
		});
		// SUCCESS: must match the response from API with provided response type
		expect(DeployAgencyToken).toMatchObject(response.data);

		// FAIL TEST CASES
		deployAgencyToken().catch(e => {
			// FAIL: if no agency ID and payload is provided
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});

	it('Get agency details', async () => {
		const response = {
			statusText: 'OK',
			data: {
				token: {
					name: 'Satya',
					symbol: 'STY',
					supply: 10000000000000
				},
				contracts: {
					rahat_erc20: '0x9B7f6EcF241dd86089884928807c004A3daE8058',
					rahat_erc1155: '0x80909144BEDda80eB4D4896ac7b7dC537f0bAb1F',
					rahat: '0xec48893EEfB1965626CE9F1f87eC63889b311757',
					rahat_admin: '0xf90CA14dC3C498274DFA11084bBE0c9E7525E20C'
				},
				kobotool_auth: {
					kpi: 'kobo.humanitarianresponse.info',
					token: 'a4937017b5399c485c8b8d02db89895656505650'
				},
				is_approved: true,
				is_archived: false,
				_id: '5ff99ccbc00c1432b1ecd902',
				name: 'eSatya',
				phone: '1231231232',
				email: 'esatya@gmail.com',
				address: 'kupondole',
				created_at: '2021-01-09T12:08:43.739Z',
				updated_at: '2021-10-04T02:41:01.662Z',
				__v: 0,
				kobotool_assets: [
					{
						labels: ['name', 'address', 'phone'],
						_id: '615a69bd18b3c0d3161a5bab',
						asset_id: 'a7sSTN4tc2p3dsAzg4Uaew',
						asset_name: 'Beneficiary Onboard'
					}
				],
				id: '5ff99ccbc00c1432b1ecd902'
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		const AgencyDetails = await getAgencyDetails(agencyId);

		// SUCCESS: must send api, headers and id while calling getAgencyDetail API.
		expect(axios.get).toHaveBeenCalledWith(`${API.AGENCY}/${agencyId}`, { headers: { access_token: access_token } });
		// SUCCESS: must match the response from API with provided response type
		expect(AgencyDetails).toMatchObject(response.data);

		// FAIL TEST CASES
		getAgencyDetails('').catch(e => {
			// FAIL: if no agency id is provided
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});

	it('List agency', async () => {
		const query = {};
		const response = {
			statusText: 'OK',
			data: {
				_id: '5ff99ccbc00c1432b1ecd902',
				name: 'eSatya',
				phone: '1231231232',
				email: 'esatya@gmail.com',
				address: 'kupondole'
			}
		};
		axios.get.mockResolvedValueOnce(response).mockRejectedValueOnce();
		const ListAgency = await listAgency(query);

		// SUCCESS: must send api, headers and query while calling listAgency API.
		expect(axios.get).toHaveBeenCalledWith(`${API.AGENCY}?${qs.stringify(query)}`, {
			headers: { access_token: access_token }
		});
		// SUCCESS: must match the response from API with provided response type
		expect(ListAgency).toMatchObject(response.data);

		// FAIL TEST CASES
		listAgency().catch(e => {
			// FAIL: if no query is provided
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});

	it('Approve agency', async () => {
		const response = {
			statusText: 'OK',
			data: {
				_id: '5ff99ccbc00c1432b1ecd902',
				name: 'eSatya',
				phone: '1231231232',
				email: 'esatya@gmail.com',
				address: 'kupondole'
			}
		};
		axios.patch.mockResolvedValueOnce(response).mockRejectedValueOnce();
		const ApproveAgency = await approveAgency(agencyId);

		// SUCCESS: must send api, headers and query while calling approveAgency API.
		expect(axios.patch).toHaveBeenCalledWith(
			`${API.AGENCY}/${agencyId}/approve`,
			{},
			{ headers: { access_token: access_token } }
		);
		// SUCCESS: must match the response from API with provided response type
		expect(ApproveAgency).toMatchObject(response.data);

		// FAIL TEST CASES
		approveAgency('').catch(e => {
			// FAIL: if no agency ID is provided
			expect(e).toMatchObject({ statusText: 'FAIL', data: {} });
		});
	});
});
