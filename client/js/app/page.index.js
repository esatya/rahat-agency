import ProjectTable from './list.panel';
import config from '../config';
import getWeb3 from '../helper/getWeb3';
import Service from './service';
import cashAidFactoryArtifact from '../../../build/contracts/CashAidFactory';
import { initContract } from '../helper/contract';

$(document).ready(async () => {
  console.log(config.debugMode);

  const web3 = await getWeb3();
  let account = await web3.eth.getCoinbase();
  const cashAidFactoryInstance = await initContract(web3, cashAidFactoryArtifact);

  $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);

  window.ethereum.on('accountsChanged', async (accounts) => {
    account = await web3.eth.getCoinbase();
    $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  });
  const pt = new ProjectTable({ target: '#project-table', instance: cashAidFactoryInstance });
  pt.on('verify-address', async (e, d) => {
    const res = await Service.verify({ address: account });
    if (res) {
      window.location.pathname = `/app/${d.eth_address}`;
    } else {
      swal.fire({
        title: 'Invalid Account',
        text: 'current account is not registered as vendor',
        icon: 'error',
      });
    }
  });
});
