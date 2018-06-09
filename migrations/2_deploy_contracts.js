const SampleCrowdsale = artifacts.require("SampleCrowdsale");
const SampleCrowdsaleToken = artifacts.require("SampleCrowdsaleToken");
const RefundVault = artifacts.require("RefundVault");

module.exports = async function(deployer, network, accounts) {
  let owner = accounts[0];

  // Log owner's ETH balance before deploy
  ownerBalance = await web3.fromWei(web3.eth.getBalance(owner));
  console.log("Balance Before Deploy: ", ownerBalance.toNumber());

  let tokenInstance, crowdsaleInstance;

  const ethRate = new web3.BigNumber(1);
  const wallet = owner;

  const startTime = Date.now() / 1000 + duration.minutes(5);
  const endTime = Date.now() / 1000 + duration.minutes(25);

  const rate = new BigNumber(10);
  const goal = ether(10);
  const cap = ether(20);

  let token, vault, crowdsale;
  deployer
    .then(function() {
      return SampleCrowdsaleToken.new({ from: wallet });
    })
    .then(function(instance) {
      token = instance;
      return RefundVault.new(wallet, { from: wallet });
    })
    .then(function(instance) {
      vault = instance;
      return SampleCrowdsale.new(
        startTime,
        endTime,
        rate,
        wallet,
        goal,
        cap,
        token.address
      );
    })
    .then(function(instance) {
      crowdsale = instance;
      token.transferOwnership(crowdsale.address);
      vault.transferOwnership(crowdsale.address);
      console.log("Token address: ", token.address);
      console.log("Crowdsale address: ", crowdsale.address);

      return true;
    })
    .then(async instance => {
      // Log owner's ETH balance after deploy
      ownerBalance = await web3.fromWei(web3.eth.getBalance(owner));
      console.log("Balance After Deploy: ", ownerBalance);
    });
};

function ether(n) {
  return new web3.BigNumber(web3.toWei(n, "ether"));
}
const BigNumber = web3.BigNumber;

function latestTime() {
  return web3.eth.getBlock("latest").timestamp;
}

const duration = {
  seconds: function(val) {
    return val;
  },
  minutes: function(val) {
    return val * this.seconds(60);
  },
  hours: function(val) {
    return val * this.minutes(60);
  },
  days: function(val) {
    return val * this.hours(24);
  },
  weeks: function(val) {
    return val * this.days(7);
  },
  years: function(val) {
    return val * this.days(365);
  }
};
