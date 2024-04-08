var Migrations = artifacts.require("./store.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Migrations, { from: accounts[1], value: 10e17 });
};
