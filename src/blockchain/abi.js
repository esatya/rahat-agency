import {ethers} from "ethers";

export const getAbi = (contractName) => {
  const contractJson = require(`../blockchain/build/${contractName}`);
  return contractJson.abi;
};

export const getSigner = async () => {
  window.ethereum.enable();
  const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return { provider, signer };
};

export const getContract = async (contractAddress, contractName) => {
  const abi = await getAbi(contractName);
  const { signer } = await getSigner();
  return new ethers.Contract(contractAddress, abi, signer);
};

export const getContractByProvider = async (contractAddress, contractName) => {
  const abi = await getAbi(contractName);
  const { provider } = await getSigner();
  return new ethers.Contract(contractAddress, abi, provider);
};
