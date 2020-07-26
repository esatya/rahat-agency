// const config = require("../config");
const util = require('ethereumjs-util');
const CryptoJS = require('crypto-js');
const leftPad = require('left-pad');
const EthereumjsTx = require('ethereumjs-tx');
const { web3 } = require('./web3Helper');

class Transaction {
  static createTx(abi, functionName, args, wrapperTx, privateKey = null) {
    const types = Transaction.getTypesFromAbi(abi, functionName);
    const txData = Transaction.encodeFunctionTxData(functionName, types, args);

    const txObject = {};
    txObject.to = Transaction.add0x(wrapperTx.to);
    txObject.gasPrice = Transaction.add0x(wrapperTx.gasPrice);
    txObject.gasLimit = Transaction.add0x(wrapperTx.gasLimit);
    txObject.nonce = Transaction.add0x(wrapperTx.nonce);
    txObject.data = Transaction.add0x(txData);
    txObject.value = Transaction.add0x(wrapperTx.value);

    const tx = new EthereumjsTx(txObject);
    if (privateKey != null) {
      tx.sign(Buffer.from(util.stripHexPrefix(privateKey), 'hex'));
    }
    return tx.serialize().toString('hex');
  }

  static encodeFunctionTxData(functionName, types, args) {
    const fullName = `${functionName}(${types.join()})`;
    const signature = CryptoJS.SHA3(fullName, { outputLength: 256 })
      .toString(CryptoJS.enc.Hex)
      .slice(0, 8);
    return signature + util.stripHexPrefix(web3.eth.abi.encodeParameters(types, args));
  }

  static add0x(input) {
    // consider addHexPrefix forn utils
    if (typeof input !== 'string') {
      return input;
    } if (input.length < 2 || input.slice(0, 2) !== '0x') {
      return `0x${input}`;
    }
    return input;
  }

  static pad(n) {
    if (n.startsWith('0x')) {
      n = util.stripHexPrefix(n);
    }
    // pad given input with '0' on left to make it 32byte string.
    return leftPad(n, '64', '0');
  }

  // get function input types
  static getTypesFromAbi(abi, functionName) {
    function matchesFunctionName(json) {
      return json.name === functionName && json.type === 'function';
    }

    function getTypes(json) {
      return json.type;
    }

    const funcJson = abi.filter(matchesFunctionName)[0];

    return funcJson.inputs.map(getTypes);
  }
}

module.exports = Transaction;
