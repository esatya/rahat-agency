const Web3 = require('web3');
// const contract = require("truffle-contract");
const config = require('config');

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
let web3;
let wsWeb3;
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  web3 = new Web3(web3.currentProvider);
} else {
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  web3 = new Web3(new Web3.providers.HttpProvider(config.get('web3.httpProvider')));
  wsWeb3 = new Web3(new Web3.providers.WebsocketProvider(config.get('web3.webSocketProvider')));
}

module.exports = {
  web3,
  wsWeb3,
};
