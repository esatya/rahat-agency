import { ethers } from 'ethers';
const NETWORK_URL = process.env.REACT_APP_BLOCKCHAIN_NETWORK;

export const getAbi = contractName => {
	const contractJson = require(`../blockchain/build/${contractName}`);
	return contractJson.abi;
};

export const getSigner = async () => {
	let signer;
	let provider;
	if (window.ethereum) {
		window.ethereum.enable();
		signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
		provider = new ethers.providers.Web3Provider(window.ethereum);
	} else {
		signer = new ethers.providers.JsonRpcProvider(NETWORK_URL).getSigner();
		provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
	}
	return { provider, signer };
};

export const getContract = async (contractAddress, contractName) => {
	const abi = await getAbi(contractName);
	const { signer } = await getSigner();
	return new ethers.Contract(contractAddress, abi, signer);
};

export const getContractByProvider = (contractAddress, contractName) => {
	const abi = getAbi(contractName);
	const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
	return new ethers.Contract(contractAddress, abi, provider);
};

export const getUncheckedProvider = (contractAddress,contractName) => {
	const abi = getAbi(contractName);
	const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
	const unchecked = provider.getUncheckedSigner();
	console.log({unchecked});
	return new ethers.Contract(contractAddress, abi, unchecked);
}

export const getContractInstance = async (contractAddress, contractName, wallet) => {
	const contract = getContractByProvider(contractAddress, contractName);
	return contract.connect(wallet);
};

export const getContractInterface = (contractName) => {
	const abi = getAbi(contractName);
	return new ethers.utils.Interface(abi);
}

export const generateMultiCallData = (contractName,functionName,params) => {
	const iface = getContractInterface(contractName);
	return iface.encodeFunctionData(functionName,params)
}

// hri = human readable interface
export const generateSignaturesWithInterface = (hri,functionName,params) => {
	const iface = new ethers.utils.Interface(hri);
	return iface.encodeFunctionData(functionName,params)
}

export const getBalance = async (walletAddress) => {
	const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
	const balance = await provider.getBalance(walletAddress);
	const etherBalance = ethers.utils.formatUnits(balance)
	if(etherBalance.length > 5) return etherBalance.slice(0,5);
	return etherBalance;
}