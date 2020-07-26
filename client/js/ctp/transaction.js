const { web3 } = require("../../../scripts/web3Helper");

function createTransaction(to, data, value, gas) {
  var transaction = {
    to: to,
    data: data,
    value: value,
    gas: gas
  };

  return transaction;
}

//transaction must include from
function signTxData(transaction) {

  var pendingCount = await web3.eth.getTransactionCount(sender.address, "pending");
  transaction.nonce = pendingCount;
  var signedTransaction = await web3.eth.signTransaction(transaction);

  return signedTransaction;
}

//function sendToRelay() {}
