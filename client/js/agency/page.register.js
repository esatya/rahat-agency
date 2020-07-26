import AgencyRegister from './register.panel';
import getWeb3 from '../helper/getWeb3';

$(document).ready(async () => {
  const web3 = await getWeb3();

  const agencyAdd = new AgencyRegister({
    target: '#agencyRegister',
  });

  agencyAdd.on('agency-registered', () => {
    alert('agency registered');
  });
});
