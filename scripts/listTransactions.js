const { web3, wsWeb3 } = require('./web3Helper');
const cashAidFactoryArtfact = require('../build/contracts/CashAidFactory');

const contractAddress = cashAidFactoryArtfact.networks[5777].address;
const wsInstance = new wsWeb3.eth.Contract(cashAidFactoryArtfact.abi, contractAddress);
const instance = new web3.eth.Contract(cashAidFactoryArtfact.abi, contractAddress);

async function getTokenTransactions(vendor) {
  const txLog = await instance.getPastEvents('LogTokenClaimed', {
    filter: { _vendor: vendor },
    fromBlock: 0,
    toBlock: 'latest',
  });

  const data = txLog
    .map((e, i) => {
      console.log(e);
      return e;
    })
    .reduce((acc, item) => {
      const obj = {};
      obj.vendor = item.returnValues._vendor;
      obj.contract = item.returnValues._contract;
      obj.phone = item.returnValues._phone;
      obj.amount = item.returnValues._amount;
      obj.blockNumber = item.blockNumber;
      acc.push(obj);

      return acc;
    }, []);
  console.log('Reduced', data);
}
getTokenTransactions('0xC52e90DB78DeB581D6CB8b5aEBda0802bA8F37B5');

module.exports = { getTokenTransactions };
