// import axios from 'axios';
// import { listNftPackages, getPackageDetails } from '../../../src/services/aid';
// import API from '../../../src/constants/api';
// import 'regenerator-runtime/runtime';
// import qs from 'query-string';

// jest.mock('axios');

// // const agencyId = '5ff99ccbc00c1432b1ecd902';
// const projectId = '123';
// const access_token = null;
// const packageId = '432';

describe('Project api calls', () => {
	it('abc', () => {});
	// it('List NFT packages', async () => {
	// const response = {
	// 	data: {
	// 		_id: '619886b06063fd2e2424fad1',
	// 		name: 'aqua water',
	// 		location: 'hashdf'
	// 	}
	// };
	// const query = {};
	// axios.get.mockResolvedValueOnce(response);
	// const ListNftPackages = await listNftPackages(projectId, query);
	// expect(axios.get).toHaveBeenCalledWith(`${API.NFT}/${projectId}/list?${qs.stringify(query)}`, query, {
	// 	headers: { access_token: access_token }
	// });
	// expect(ListNftPackages).toMatchObject(response.data); //response.data
	// });
	// it('Get package details', async () => {
	// 	const response = {
	// 		data: {
	// 			fiatValue: '1000',
	// 			description: 'Rice package'
	// 		}
	// 	};
	// 	axios.get.mockResolvedValueOnce(response);
	// 	const GetPackageDetails = await getPackageDetails(packageId);
	// 	expect(axios.get).toHaveBeenCalledWith(`${API.NFT}/${packageId}`, {
	// 		headers: { access_token: access_token }
	// 	});
	// 	expect(GetPackageDetails).toMatchObject(response.data); //response.data
	// });
});
