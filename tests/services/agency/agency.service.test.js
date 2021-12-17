import axios from 'axios';
import { getAgencyDetails } from '../../../src/services/agency';
import API from '../../../src/constants/api';
import 'regenerator-runtime/runtime';
// import mockAxios from 'axios';

const access_token = 'ASDF123';

jest.mock('axios');
// mockAxios.get.mockResolvedValue({ data: { name: 'eSatya' } });

describe('Agency api calls', () => {
	it('Get agency details', async () => {
		const agencyId = '5ff99ccbc00c1432b1ecd902';
		// axios.get.mockResolvedValue({
		// 	data: {
		// 		token: {
		// 			name: 'Satya',
		// 			symbol: 'STY',
		// 			supply: 10000000000000
		// 		},
		// 		contracts: {
		// 			rahat_erc20: '0x9B7f6EcF241dd86089884928807c004A3daE8058',
		// 			rahat_erc1155: '0x80909144BEDda80eB4D4896ac7b7dC537f0bAb1F',
		// 			rahat: '0xec48893EEfB1965626CE9F1f87eC63889b311757',
		// 			rahat_admin: '0xf90CA14dC3C498274DFA11084bBE0c9E7525E20C'
		// 		},
		// 		kobotool_auth: {
		// 			kpi: 'kobo.humanitarianresponse.info',
		// 			token: 'a4937017b5399c485c8b8d02db89895656505650'
		// 		},
		// 		is_approved: true,
		// 		is_archived: false,
		// 		_id: '5ff99ccbc00c1432b1ecd902',
		// 		name: 'eSatya',
		// 		phone: '1231231232',
		// 		email: 'esatya@gmail.com',
		// 		address: 'kupondole',
		// 		created_at: '2021-01-09T12:08:43.739Z',
		// 		updated_at: '2021-10-04T02:41:01.662Z',
		// 		__v: 0,
		// 		kobotool_assets: [
		// 			{
		// 				labels: ['name', 'address', 'phone'],
		// 				_id: '615a69bd18b3c0d3161a5bab',
		// 				asset_id: 'a7sSTN4tc2p3dsAzg4Uaew',
		// 				asset_name: 'Beneficiary Onboard'
		// 			}
		// 		],
		// 		id: '5ff99ccbc00c1432b1ecd902'
		// 	}
		// });
		// axios.get.mockImplementationOnce(() => Promise.resolve({ data }));
		const AgencyDetail = await getAgencyDetails(agencyId);
		console.log({ AgencyDetail });
		expect(AgencyDetail).toBeDefined();
		// expect(typeof AgencyDetail).toBe('object');
		// expect(AgencyDetail).toMatchObject({ name: 'eSatya' });
		// expect(axios.get).toHaveBeenCalled();
		// expect(AgencyDetail).toBe("eSatya")
	});
});
