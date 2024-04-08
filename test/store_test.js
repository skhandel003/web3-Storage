const HelloBlockchain = artifacts.require("./store.sol");
const assert = require("assert");
contract("HelloBlockchain", (accounts) => {
  const owner = accounts[0];
  it("running checks", async () => {
    const helloBlockchainInstance = await HelloBlockchain.deployed();

    await helloBlockchainInstance.pushtext("string");
    const checko = await helloBlockchainInstance.returntext({
      from: accounts[0],
    });
    assert.equal("string", checko, "setting ownwer data");
  });
});
