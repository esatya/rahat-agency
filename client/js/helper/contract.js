import config from '../config';

async function initContract(web3, artifact, address) {
  // let web3 = await getWeb3();

  if (!address) {
    address = artifact.networks[config.networkId].address;
  }

  try {
    const instance = await new web3.eth.Contract(artifact.abi, address);

    return instance;
  } catch (error) {
    console.log(error);
    console.error('Could not connect to contract or chain.');
  }
}

export { initContract };
