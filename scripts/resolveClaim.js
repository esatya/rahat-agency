const sha256 = require('sha256');
const { web3, wsWeb3 } = require('./web3Helper');
const CashAid = require('../build/contracts/CashAidFactory');
const { sendMail } = require('../helpers/services/mailer');
const { sendSMS } = require('../helpers/services/sms');

console.log(web3.currentProvider);

function resolveClaim(networkId) {
  const networkAddress = CashAid.networks[networkId].address;
  // console.log("ABI", CashAid.abi)
  const instance = new web3.eth.Contract(CashAid.abi, networkAddress);
  const wsInstance = new wsWeb3.eth.Contract(CashAid.abi, networkAddress);

  const releaseData = {};
  console.log(networkAddress);

  wsInstance.events
    .LogTokenClaimed(
      {
        // Using an array means OR: e.g. 20 or 23
        fromBlock: 'latest',
      },
      async (error, event) => {
        // console.log("current", event);
        console.log('evneneneneneneeenne................', event); // same results as the optional callback above
        releaseData.contractAddress = event.returnValues._contract;
        releaseData.vendor = event.returnValues._vendor;
        releaseData.phone = event.returnValues._phone;
        releaseData.token = event.returnValues._amount;

        console.log('releasedata,,..............', releaseData);
        releaseData.otp = generateRandom();
        releaseData.otpHash = `0x${await sha256(releaseData.otp.toString())}`;
        console.log(releaseData.otp, releaseData.otpHash);
        web3.eth.getAccounts().then(async (a) => {
          const data = await instance.methods
            .releaseToken(
              releaseData.contractAddress,
              releaseData.vendor,
              releaseData.phone,
              releaseData.otpHash,
            )
            .send({ from: a[0] });

          console.log('receiptdata', data);
          if (data.status) {
            console.log('tranasction done,.....', releaseData, releaseData.phone);
            const receiver = `+977${releaseData.phone}`;
            await sendSMS(receiver, releaseData);
          }
        });
      },
    )

    .on('error', console.error);
}

function generateRandom() {
  return Math.floor(100000 + Math.random() * 900000);
}

module.exports = { resolveClaim };
