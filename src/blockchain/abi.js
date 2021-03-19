import {ethers} from "ethers";
const NODE_URL = process.env.REACT_APP_BLOCKCHAIN_NODE;

export const getAbi = (contractName) => {
  const contractJson = require(`../blockchain/build/${contractName}`);
  return contractJson.abi;
};

export const getSigner = async () => {
  let signer;
  let provider;
  if(window.ethereum){
  window.ethereum.enable();
  signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
  provider = new ethers.providers.Web3Provider(window.ethereum);
  }
  else{
  signer = new ethers.providers.JsonRpcProvider(NODE_URL).getSigner();
  provider = new ethers.providers.JsonRpcProvider(NODE_URL);
  }
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
