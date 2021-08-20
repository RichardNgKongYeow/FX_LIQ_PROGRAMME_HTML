const DepositWallet = artifacts.require("DepositWallet");

module.exports = function(deployer) {
  deployer.deploy(DepositWallet);
};
