let abi = require("../build/contracts/CashAid");
const CryptoJS = require("crypto-js");
const util = require("ethereumjs-util");
const { web3 } = require("../scripts/web3Helper");
const EthereumjsTx = require("ethereumjs-tx");

let wrapperTx = {
  gas: 2000000,
  gasPrice: 2000000,
  gasLimit: 2000000,
  value: 0,
  to: 0xcdee632fb1ba1b3156b36cc0bdabbfd821305e06,
  nonce: 3, // nonce of address which signs tx ad server
  from: 0x11b4c96ce7e32e1739d697da1c77b292af21f8ad
};
let contractAddress = abi.networks[5777].address;
console.log("contractAddress===", contractAddress);

function getTypesFromAbi(abi, functionName) {
  function matchesFunctionName(json) {
    return json.name === functionName && json.type === "function";
  }

  function getTypes(json) {
    return json.type;
  }

  let funcJson = abi.filter(matchesFunctionName)[0];

  return funcJson.inputs.map(getTypes);
}

function getJsonInterface(abi, functionName) {
  function matchesFunctionName(json) {
    return json.name === functionName && json.type === "function";
  }

  function getTypes(json) {
    return json.type;
  }

  let funcJson = abi.filter(matchesFunctionName)[0];

  return funcJson;
}
function add0x(input) {
  //consider addHexPrefix forn utils
  if (typeof input !== "string") {
    return input;
  } else if (input.length < 2 || input.slice(0, 2) !== "0x") {
    return "0x" + input;
  } else {
    return input;
  }
}

let instance = new web3.eth.Contract(abi.abi, contractAddress);
let encoded = instance.methods
  .release(
    "0xcDEe632FB1Ba1B3156b36cc0bDabBfd821305e06",
    "9841602388",
    "0x1d6442ddcfd9db1ff81df77cbefcd5afcc8c7ca952ab3101ede17a84b866d3f3"
  )
  .encodeABI();

console.log("encoded=====", encoded);

function createTransaction(to, data, value, gas) {
  var transaction = {
    to: to,
    data: data,
    value: value,
    gas: gas,
    gasPrice: 2000000,
    gasLimit: 2000000,
    nonce: 3
  };

  return transaction;
}

//
function createTx(abi, functionName, args, wrapperTx, privateKey = null) {
  let jsonInterface = getJsonInterface(abi, functionName);
  let txData = web3.eth.abi.encodeFunctionCall(jsonInterface, args);

  let txObject = {};
  txObject.to = add0x(wrapperTx.to);
  txObject.gasPrice = add0x(wrapperTx.gasPrice);
  txObject.gasLimit = add0x(wrapperTx.gasLimit);
  txObject.nonce = add0x(wrapperTx.nonce);
  txObject.data = add0x(txData);
  txObject.value = add0x(wrapperTx.value);

  let tx = new EthereumjsTx(txObject);
  // console.log("transaction===", tx);
  if (privateKey != null) {
    tx.sign(Buffer.from(util.stripHexPrefix(privateKey), "hex"));
  }
  return tx.serialize().toString("hex");
}

function encodeFunctionTxData(functionName, types, args) {
  let fullName = functionName + "(" + types.join() + ")";
  let web3Sign = web3.eth.abi.encodeFunctionSignature(fullName);
  console.log("web3 signature", web3Sign);
  let signature = web3.eth.abi.encodeFunctionSignature(fullName);
  return signature + util.stripHexPrefix(web3.eth.abi.encodeParameters(types, args));
}

let params = {
  to: 0xcdee632fb1ba1b3156b36cc0bdabbfd821305e06,
  value: 0,
  nonce: 2, // nonce must match the one at TxRelay contract
  gas: 2000000,
  gasPrice: 2000000,
  gasLimit: 2000000
};
function createWrapperTx(abi, functionName, args, params) {
  let wrapperTx = new EthereumjsTx(params);
  //console.log("wrra", wrapperTx);
  return wrapperTx;
}

let func = getTypesFromAbi(abi.abi, "release");
let jsonInterface = getJsonInterface(abi.abi, "release");

let args = [
  "0xcDEe632FB1Ba1B3156b36cc0bDabBfd821305e06",
  "9841602388",
  "0x1d6442ddcfd9db1ff81df77cbefcd5afcc8c7ca952ab3101ede17a84b866d3f3"
];

let functioncall = web3.eth.abi.encodeFunctionCall(jsonInterface, args);

console.log("function call signature \n", functioncall);

// console.log(jsonInterface);
// console.log("function types", func);
let signature = encodeFunctionTxData("release", func, args);

let createdtx = createTx(
  abi.abi,
  "release",
  args,
  wrapperTx,
  "0x934B87166A28D2C4F0E8DBFD4C92CCF8ADE53092934E204388921476DFCB76E5"
);

console.log("created transaction", createdtx);
// let wrappedTx = createWrapperTx(abi.abi, "release", args, params);
// console.log("wrappedtx only params\n", wrappedTx);

console.log("signature", signature);

let transaction = createTransaction(
  "0xcdee632fb1ba1b3156b36cc0bdabbfd821305e06",
  encoded,
  0,
  2000000
);

console.log("Transactiuon =", transaction);

let web3SignedTransaction = web3.eth.accounts
  .signTransaction(
    transaction,
    "0x934B87166A28D2C4F0E8DBFD4C92CCF8ADE53092934E204388921476DFCB76E5"
  )
  .then(function (signed) {
    console.log("signed=======================", signed);
    return signed;
  });

console.log("WEB3 SIGNED TRANSACTION", web3SignedTransaction);
