var AidToken = artifacts.require("AidToken");
var CashAid = artifacts.require("CashAid");
var TokenFactory = artifacts.require("TokenFactory");
var CashAidFactory = artifacts.require("CashAidFactory");

module.exports = function (deployer) {
  // deployer.deploy(AidToken, 1000000).then(function () {
  //   return deployer.deploy(CashAid, AidToken.address);
  // });
  deployer.deploy(TokenFactory);
  deployer.deploy(CashAidFactory);
};
