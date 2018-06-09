var Migrations = artifacts.require("./Migrations.sol");

module.exports = async function(deployer, network, accounts) {
  let owner = accounts[0];
  // Log owner's ETH balance before deploy
  ownerBalance = await web3.fromWei(web3.eth.getBalance(owner));
  console.log("Balance Before Migrations: ", ownerBalance);
  deployer.deploy(Migrations);
};
