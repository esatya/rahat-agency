import ClaimEdit from './edit.claim';
import ClaimTable from './claim.list';
import OTP from './otp.modal';
import cashAidFactoryArtifact from '../../../build/contracts/CashAidFactory';
import cashAidArtifact from '../../../build/contracts/CashAid';
import config from '../config';
import { initContract } from '../helper/contract';
import { getTokenTransactions } from './listTransactions';
import getWeb3 from '../helper/getWeb3';

$(document).ready(async () => {
  console.log(config.debugMode);
  const web3 = await getWeb3();
  let account = await web3.eth.getCoinbase();
  const latestBlock = await web3.eth.getBlock('latest');

  const cashAidFactoryInstance = await initContract(web3, cashAidFactoryArtifact);
  const cashAidInstance = await initContract(web3, cashAidArtifact, cashAidAddress);

  const claims = await getTokenTransactions(cashAidFactoryInstance, cashAidInstance, account);

  $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);

  window.ethereum.on('accountsChanged', async (accounts) => {
    account = await web3.eth.getCoinbase();
    $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  });

  const claimEdit = new ClaimEdit({
    target: '#tokenPanel',
    tokenClaimTarget: '#claimTokenPanel',
    tokenGetTarget: '#getTokenPanel',
    factoryInstance: cashAidFactoryInstance,
    aidInstance: cashAidInstance,
    account,
  });

  const claimTable = new ClaimTable({
    target: '#claim-table',
  });

  const otp = new OTP({
    target: '#mdlEnterOTP',
    cashAidInstance,
    account,
  });

  $('#checkToken').on('click', async () => {
    const phone = $('#inputPhone').val();
    const balance = await cashAidInstance.methods.claimables(Number(phone)).call();
    alert(`Token owned by this number: ${balance}`);
  });

  claimEdit.on('token-claimed', async (e, d) => {
    const claims = await getTokenTransactions(cashAidFactoryInstance, cashAidInstance, account);
    claimTable.loadData(claims);
  });

  claimTable.on('get-token', (e, d) => {
    otp.phone = d.phone;
    otp.amount = d.amount;
    otp.open();
  });

  otp.on('token-retrieved', (e, d) => {
    otp.close();
    swal.fire({
      title: 'Token Received',
      html: `You just received <strong>${d.amount} Token</strong> from <strong>${d.phone}</strong>`,
      icon: 'success',
    });
  });

  claimTable.loadData(claims);
});
