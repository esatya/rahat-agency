import BenificiaryTable from './list.panel';
import BeneficiaryAdd from './add.modal';
import UploadForm from './upload.modal';

import config from '../config';

import getWeb3 from '../helper/getWeb3';
import cashAidFactoryArtifact from '../../../build/contracts/CashAidFactory';

import cashAidArtifact from '../../../build/contracts/CashAid';
import aidTokenArtifact from '../../../build/contracts/AidToken';
import { initContract } from '../helper/contract';

import Service from './service';

$(document).ready(async () => {
  console.log(config.debugMode);
  const web3 = await getWeb3();
  let account = await web3.eth.getCoinbase();

  let cashAidInstance;
  const cashAidFactoryInstance = await initContract(web3, cashAidFactoryArtifact);

  const tokenAddress = await cashAidFactoryInstance.methods.tokens(account).call();
  const aidTokenInstance = await initContract(web3, aidTokenArtifact, tokenAddress);

  $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  window.ethereum.on('accountsChanged', async () => {
    account = await web3.eth.getCoinbase();

    $('#currentAccount').html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  });
  // $("#totalToken").html(`<b>Total Tokens: ${totalTokens}</b>`);

  const bt = new BenificiaryTable({
    target: '#beneficiary-table',
    instance: cashAidInstance,
  });
  const beneficiaryAdd = new BeneficiaryAdd({
    target: '#mdlBeneficiaryAdd',
    instance: cashAidFactoryInstance,
    account,
    web3,
  });

  $('#btnBeneficiaryAdd').on('click', async () => {
    beneficiaryAdd.open();
  });

  const uploadForm = new UploadForm({
    target: '#mdlUploadForm',
    instance: cashAidFactoryInstance,
    account,
    web3,
  });

  $('#btnUploadData').on('click', async (e) => {
    uploadForm.open();
  });

  uploadForm.on('bulk-beneficiary-added', async (e, d) => {
    swal.fire({
      title: 'Beneficiary Registered',
      text: 'Beneficiaries added successfully',
      icon: 'success',
    });
    bt.reload();
  });

  beneficiaryAdd.on('beneficiary-added', () => {
    bt.reload();
  });

  bt.on('aid-selected', async (e, d) => {
    try {
      cashAidInstance = await initContract(web3, cashAidArtifact, d.eth_address);
      window.aidId = d.id;

      const { data } = await Service.beneficiaryOnAid(d.id);

      try {
        await Promise.all(data.map(async (el) => {
          const claimable = await cashAidInstance.methods.claimables(Number(el.phone)).call();
          el.updatedClaimable = claimable;
          if (el.claimable != claimable) {
            await Service.updateClaimable(aidId, { beneficiaryId: el._id, claimable });
          }
          return el;
        }));
      } catch (e) {
        console.log(e);
      }

      bt.load(`${config.apiPath}/aid/${d._id}/beneficiary`);
    } catch (e) {
      console.error(e);
    }
  });

  bt.on('issue-token', async (e, d) => {
    const receipt = await cashAidInstance.methods.issue(Number(d.phone), 50).send({ from: account });
    const claimable = await cashAidInstance.methods.claimables(d.phone).call();

    await Service.updateClaimable(aidId, { beneficiaryId: d.id, claimable });
    bt.reload();
  });
});
