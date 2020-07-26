const util = require('ethereumjs-util');
const EthereumjsTx = require('ethereumjs-tx');
const config = require('./config');
const { web3 } = require('./web3Helper');
const Transaction = require('./transaction');

// const provider = new Web3.providers.HttpProvider(config.endpoint);
// const web3 = new Web3(provider);

class MetaTransactionClient {
  /**
   * Create unsigned Tx object which has real tx as data
   * @param abi
   * @param functionName
   * @param args
   * @param params
   */
  // raw transaction
  static createTx(abi, functionName, args, params) {
    const wrapperTx = new EthereumjsTx(params);
    return Transaction.createTx(abi, functionName, args, wrapperTx);
  }

  /**
   * Create data that can be sent to server. sent data is then signed at server and thrown to network
   * @param rawTx
   * @param selfAddress
   * @param selfPrivateKey
   * @param txRelayAddress
   * @returns {Promise<{sig: *, to: string, from: *, data: string}>}
   */
  static async createRawTxToRelay(rawTx, selfAddress, selfPrivateKey, txRelayAddress) {
    const txCopy = new EthereumjsTx(Buffer.from(util.stripHexPrefix(rawTx), 'hex'));
    const nonce = txCopy.nonce.toString('hex') ? txCopy.nonce.toString('hex') : '0'; // if buffer is empty, nonce should be zero
    const to = txCopy.to.toString('hex');
    const data = txCopy.data.toString('hex');

    // Tight packing, as Solidity sha3 does
    const hashInput = `0x1900${
      util.stripHexPrefix(txRelayAddress)
    }${util.stripHexPrefix(selfAddress)
    }${Transaction.pad(nonce)
    }${to
    }${data}`;

    const hash = web3.utils.sha3(hashInput);
    const sig = MetaTransactionClient._signMsgHash(hash, selfPrivateKey);

    return {
      sig,
      to,
      from: selfAddress,
      data,
    };
  }

  /**
   *
   *  Private methods
   *
   */

  static _signMsgHash(msgHash, privateKey) {
    return util.ecsign(
      Buffer.from(util.stripHexPrefix(msgHash), 'hex'),
      Buffer.from(util.stripHexPrefix(privateKey), 'hex'),
    );
  }
}

module.exports = MetaTransactionClient;
