const { web3 } = require('./web3Helper');

const config = require('./config');

class Accounts {
  accounts() {
    web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        console.log('There was an error fetching your accounts.');
        console.log(err);
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      const accounts = accs;

      return accounts;
    });
  }

  async createAccount(seed, password) {
    try {
      const account = await web3.eth.accounts.create(seed);
      const { address } = account;
      const keystore = await web3.eth.accounts.encrypt(account.privateKey, password);
      return [account, keystore];
    } catch (e) {
      console.log('Error Occured', e);

      return e;
    }
  }

  async sendBalance(req, res) {
    const addr = req.body.address;
    const { value } = req.body;
    const transaction = {
      from: config.adminAddress,
      to: addr,
      value,
      gas: 300000,
    };
    const ac = new Accounts();
    try {
      const result = await ac.signAndSendTransaction(transaction, config.adminPrivateKey);

      res.json(result);
    } catch (e) {
      console.log('Error Occured', e);
      res.json({
        logs: e.message,
        status: false,
      });
    }
  }

  getBalance(req, res) {
    const addr = req.body.address;
    web3.eth.getBalance(addr, (e, balance) => {
      console.log('balance is', balance);
      res.send({
        balance,
      });
    });
  }

  async generateAddress() {
    let userAddress;
    try {
      console.log('adfdsfds');
      const account = await web3.eth.accounts.create('new account');
      userAddress = account.address;
    } catch (e) {
      console.log('Error Occured', e);
    }
    return userAddress;
  }

  createTransaction(to, data, value, gas) {
    const transaction = {
      to,
      data,
      value,
      gas,
    };

    return transaction;
  }

  async signAndSendTransaction(transaction, privateKey) {
    const sender = await web3.eth.accounts.privateKeyToAccount(privateKey);
    const count = await web3.eth.getTransactionCount(sender.address);
    const pendingCount = await web3.eth.getTransactionCount(sender.address, 'pending');
    transaction.nonce = pendingCount;
    const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);

    const receipt = await web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction)
      .on('receipt', console.log);

    return {
      receipt,
    };
  }
}

module.exports = new Accounts();
