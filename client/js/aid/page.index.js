import AidTable from './list.panel';
import AidAdd from './add.modal';

import config from '../config';

import getWeb3 from '../helper/getWeb3';
import cashAidFactoryArtifact from '../../../build/contracts/CashAidFactory';

import aidTokenArtifact from '../../../build/contracts/AidToken';
import { initContract } from '../helper/contract';

$(document).ready(async () => {
  console.log(config.debugMode);
  const web3 = await getWeb3();
  let account = await web3.eth.getCoinbase();
  const cashAidFactoryInstance = await initContract(web3, cashAidFactoryArtifact);

  const tokenAddress = await cashAidFactoryInstance.methods.tokens(account).call();

  const aidTokenInstance = await initContract(web3, aidTokenArtifact, tokenAddress);
  let totalTokens;
  try {
    totalTokens = await aidTokenInstance.methods.balanceOf(account).call();
  } catch (e) {
    alert('Invalid Metamask Account');
    console.error('Invalid account');
  }

  $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  window.ethereum.on('accountsChanged', async () => {
    account = await web3.eth.getCoinbase();
    $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  });

  $('#totalToken').html(`<b>Total Tokens: ${totalTokens}</b>`);

  const at = new AidTable({ target: '#aid-table' });
  const aidAdd = new AidAdd({
    target: '#mdlAidAdd',
    instance: cashAidFactoryInstance,
    account,
  });

  $('#btnAidAdd').on('click', () => {
    aidAdd.open();
  });

  at.on('deploy-contract', async (e, d) => {
    // dploy contract
    // update aid db
    // show in list
    // check contract address
    // use websoket web3 to listen event
    try {
      const token = await cashAidFactoryInstance.methods.tokens(account).call();
      const receipt = await cashAidFactoryInstance.methods
        .createAid(tokenAddress, d.id)
        .send({ from: account });
      if (receipt.status) {
        const contractAddress = await cashAidFactoryInstance.methods.CashAids(account, d.id).call();
        const data = { eth_address: contractAddress };
        aidAdd.setContractAddress(d.id, data);
      }
    } catch (e) {
      console.log(e);
    }
  });

  aidAdd.on('aid-added', () => {
    at.reload();
  });
  aidAdd.on('contract-deployed', () => {
    at.reload();
  });

  $('btnIssueToken').on('click', (e) => {
    console.log('btnclicked');
  });
});
