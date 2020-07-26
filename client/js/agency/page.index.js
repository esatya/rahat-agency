import AgencyTable from './list.panel';
import AgencyAdd from './add.modal';

import config from '../config';
import getWeb3 from '../helper/getWeb3';
import cashAidFactoryArtifact from '../../../build/contracts/CashAidFactory';
import { initContract } from '../helper/contract';

$(document).ready(async () => {
  console.log(config.debugMode);
  const web3 = await getWeb3();
  let account = await web3.eth.getCoinbase();
  const cashAidFactoryInstance = await initContract(web3, cashAidFactoryArtifact);
  const cashAidFactoryaddress = cashAidFactoryArtifact.networks[config.networkId].address;

  $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  window.ethereum.on('accountsChanged', async () => {
    account = await web3.eth.getCoinbase();
    $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  });

  const ut = new AgencyTable({
    target: '#agency-table',
    instance: cashAidFactoryInstance,
    account,
    web3,
  });
  const agencyAdd = new AgencyAdd({
    target: '#mdlAgencyAdd',
    instance: cashAidFactoryInstance,
    account,
    web3,
  });

  ut.on('check-agency', async (e, d) => {
    try {
      const res = await cashAidFactoryInstance.methods.admin(d.eth_address).call();
      if (res) {
        $(`${d.target} tbody tr:eq(${d.ridx}) td:eq(${d.cidx})`).text('yourvalue');
      }
    } catch (e) {
      console.log('error');
    }
  });

  $('#btnAgencyAdd').on('click', async () => {
    // try {
    //   console.log(web3.eth);
    //   console.log(account);
    //   let rawTx = await web3.eth.signTransaction({
    //     from: account,
    //     gasPrice: "20000000000",
    //     gas: "21000",
    //     to: "0x11B4c96Ce7e32e1739d697da1C77B292AF21f8aD",
    //     value: 0,
    //     data: ""
    //   });

    //   console.log(rawTx);
    // } catch (e) {
    //   console.log(e);
    // }
    agencyAdd.open();
  });

  agencyAdd.on('agency-added', () => {
    ut.reload();
  });

  agencyAdd.on('transaction', async (e, d) => {
    const txObj = {
      from: account,
      to: cashAidFactoryaddress,
      data: d,
    };

    const add = await web3.eth.sendTransaction(txObj);
  });

  agencyAdd.on('agency-approved', () => {
    alert('agency Approved ');
    ut.reload();
  });

  ut.on('approve-agency', (e, d) => {
    agencyAdd.approveAgency(d.id, d.eth_address);
  });
});
