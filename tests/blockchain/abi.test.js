import { ethers } from 'ethers';

import 'regenerator-runtime/runtime';
import { getAbi, getSigner, getContract, getContractByProvider, getContractInstance } from '../../src/blockchain/abi';
const NETWORK_URL = process.env.REACT_APP_BLOCKCHAIN_NETWORK;

// jest.setTimeout(100000);
jest.mock('ethers');

describe('Test blockchain abi files', () => {
	const contractName = 'RahatAdmin';
	it('get Abi', () => {
		getAbi(contractName);
	});
	// it('get signer', async () => {
	// 	await getSigner();
	// 	const mockProvider = new ethers.providers.Web3Provider(window.ethereum);
	// });
});
