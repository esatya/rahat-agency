import AgencyEdit from './edit.panel';
import getWeb3 from '../helper/getWeb3';
import { initContract } from '../helper/contract';
import cashAidFactoryArtifact from '../../../build/contracts/CashAidFactory';
import aidTokenArtifact from '../../../build/contracts/AidToken';

$(document).ready(async () => {
  const web3 = await getWeb3();
  const account = await web3.eth.getCoinbase();

  const agency = new AgencyEdit({
    target: '#AgencyDetailsPanel',
  });
  await agency.loadData(aidId);
  const cashAidFactoryInstance = await initContract(web3, cashAidFactoryArtifact);

  const tokenAddress = await cashAidFactoryInstance.methods.tokens(account).call();
  const aidTokenInstance = await initContract(web3, aidTokenArtifact, tokenAddress);
  const totalTokens = await agency.getbalance(aidTokenInstance, account);
  const aidContract = await agency.getAddress();
  const tokenLocked = await agency.getbalance(aidTokenInstance, aidContract);

  $('#tokenLocked').val(tokenLocked);
  $('#totalToken').html(`<b>Total Tokens: ${totalTokens}</b>`);
  $('#currentAccount').html(`Current Account: ${account}`);

  $('#btnLoadToken').on('click', async (e) => {
    const value = $('#loadToken').val();
    const receipt = await aidTokenInstance.methods
      .transfer(aidContract, value)
      .send({ from: account });
    if (receipt.status) {
      const tokenLocked = await agency.getbalance(aidTokenInstance, aidContract);
      $('#tokenLocked').val(tokenLocked);
    }
  });
});
