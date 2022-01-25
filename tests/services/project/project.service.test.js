// import { ethers } from 'ethers';
// import axios from 'axios';
// import { listNftPackages, getPackageDetails, tokenAllocate } from '../../../src/services/aid';
// import API from '../../../src/constants/api';
// import 'regenerator-runtime/runtime';
// import qs from 'query-string';

// jest.mock('axios');
// jest.mock('ethers');

// const agencyId = '5ff99ccbc00c1432b1ecd902';
// const projectId = '123';
// const packageId = '432';

describe('Project api calls', () => {
	it('', () => {});
	// 	it('List NFT packages', async () => {
	// 		const response = {
	// 			data: {
	// 				_id: '619886b06063fd2e2424fad1',
	// 				name: 'aqua water',
	// 				location: 'hashdf'
	// 			}
	// 		};
	// 		const query = {};
	// 		try {
	// 			axios.get.mockResolvedValueOnce(response);
	// 			const ListNftPackages = await listNftPackages(projectId, query);
	// 			expect(axios.get).toHaveBeenCalledWith(`${API.NFT}/${projectId}/list?${qs.stringify(query)}`, query, {
	// 				headers: { access_token: null }
	// 			});
	// 			expect(ListNftPackages).toMatchObject(response.data);
	// 		} catch {}
	// 	});
	// 	it('Get package details', async () => {
	// 		const response = {
	// 			data: {
	// 				fiatValue: '1000',
	// 				description: 'Rice package'
	// 			}
	// 		};
	// 		try {
	// 			axios.get.mockResolvedValueOnce(response);
	// 			const GetPackageDetails = await getPackageDetails(packageId);
	// 			expect(axios.get).toHaveBeenCalledWith(`${API.NFT}/${packageId}`, {
	// 				headers: { access_token: null }
	// 			});
	// 			expect(GetPackageDetails).toMatchObject(response.data);
	// 		} catch {}
	// 	});
	// 	it('token allocate', async () => {
	// 		const response = {
	// 			data: {
	// 				fiatValue: '1000',
	// 				description: 'Rice package'
	// 			}
	// 		};
	// 		const tokens = '';
	// 		const txHash = '';
	// 		try {
	// 			axios.patch.mockResolvedValueOnce(response);
	// 			await tokenAllocate(projectId, tokens, txHash);
	// 			expect(axios.patch).toHaveBeenCalledWith(
	// 				`${API.PROJECTS}/${projectId}/token`,
	// 				{ amount: tokens, txhash: txHash },
	// 				{
	// 					headers: { access_token: null }
	// 				}
	// 			);
	// 		} catch {}
	// 	});
});
