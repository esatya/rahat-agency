import Web3 from 'web3';
import AgencyEdit from './edit.panel';
import getWeb3 from '../helper/getWeb3';
import { initContract } from '../helper/contract';
import cashAidFactoryArtifact from '../../../build/contracts/CashAidFactory';

$(document).ready(async () => {
  const web3 = await getWeb3();

  const account = await web3.eth.getCoinbase();
  const cashAidFactoryInstance = await initContract(web3, cashAidFactoryArtifact);
  let tokenAddress;

  const agency = new AgencyEdit({
    target: '.AgencyDetailsPanel',
    instnace: cashAidFactoryInstance,
    account,
  });

  agency.on('token-added', async (e, { data }) => {
    alert(`token Successfully Deployed for \n ${data.eth_address}`);
    $('#tokenDetail *').prop('disabled', true);
    tokenAddress = await agency.tokenAddress(cashAidFactoryInstance);
    $('#tokenAddress').html(`Token Address: ${tokenAddress}`);
  });

  $('#deployToken').on('click', (e) => {
    e.preventDefault();

    agency.deployToken(account, cashAidFactoryInstance);
  });

  const loaded = await agency.loadData(agencyId);

  $('#tokenAddress').html(`Token Address: ${loaded.eth_address}`);
  if (loaded.onChain) {
    $('#tokenDetail *').prop('disabled', true);
  }
});
