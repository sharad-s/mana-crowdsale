/* Imports don't work for some reason. Functions pasted at the bottom of code */
// import ether from "../helpers/ether";
// import { advanceBlock } from "../helpers/advanceToBlock";
// import { increaseTimeTo, duration } from "../helpers/increaseTime";
// import latestTime from "../helpers/latestTime";
// import EVMRevert from "../helpers/EVMRevert";
// import assertRevert from "../helpers/assertRevert";

const BigNumber = web3.BigNumber;

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

const SampleCrowdsale = artifacts.require("SampleCrowdsale");
const SampleCrowdsaleToken = artifacts.require("SampleCrowdsaleToken");
const RefundVault = artifacts.require("RefundVault");

contract("SampleCrowdsale", function([owner, wallet, investor]) {
  const RATE = new BigNumber(10);
  const GOAL = ether(10);
  const CAP = ether(20);

  before(async function() {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();
    //
    // this.openingTime = latestTime() + duration.weeks(1);
    // this.closingTime = this.openingTime + duration.weeks(1);
    // this.afterClosingTime = this.closingTime + duration.seconds(1);
    //
    // this.token = await SampleCrowdsaleToken.new({ from: owner });
    // this.vault = await RefundVault.new(wallet, { from: owner });
    // this.crowdsale = await SampleCrowdsale.new(
    //   this.openingTime,
    //   this.closingTime,
    //   RATE,
    //   wallet,
    //   GOAL,
    //   CAP,
    //   this.token.address
    // );
    // await this.token.transferOwnership(this.crowdsale.address);
    // await this.vault.transferOwnership(this.crowdsale.address);
  });
  beforeEach(async function() {
    // Log owner's ETH balance
    ownerBalance = await web3.fromWei(web3.eth.getBalance(owner));
    console.log(ownerBalance);

    this.openingTime = latestTime() + duration.weeks(1);
    this.closingTime = this.openingTime + duration.weeks(1);
    this.afterClosingTime = this.closingTime + duration.seconds(1);

    this.token = await SampleCrowdsaleToken.new({ from: owner });
    this.vault = await RefundVault.new(wallet, { from: owner });
    this.crowdsale = await SampleCrowdsale.new(
      this.openingTime,
      this.closingTime,
      RATE,
      wallet,
      GOAL,
      CAP,
      this.token.address
    );
    await this.token.transferOwnership(this.crowdsale.address);
    await this.vault.transferOwnership(this.crowdsale.address);
  });

  it("should create crowdsale with correct parameters", async function() {
    this.crowdsale.should.exist;
    this.token.should.exist;

    const openingTime = await this.crowdsale.openingTime();
    const closingTime = await this.crowdsale.closingTime();
    const rate = await this.crowdsale.rate();
    const walletAddress = await this.crowdsale.wallet();
    const goal = await this.crowdsale.goal();
    const cap = await this.crowdsale.cap();

    openingTime.should.be.bignumber.equal(this.openingTime);
    closingTime.should.be.bignumber.equal(this.closingTime);
    rate.should.be.bignumber.equal(RATE);
    walletAddress.should.be.equal(wallet);
    goal.should.be.bignumber.equal(GOAL);
    cap.should.be.bignumber.equal(CAP);
  });

  it("should not accept payments before start", async function() {
    await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMRevert);
    await this.crowdsale
      .buyTokens(investor, { from: investor, value: ether(1) })
      .should.be.rejectedWith(EVMRevert);
  });

  it("should accept payments during the sale", async function() {
    const investmentAmount = ether(1);
    const expectedTokenAmount = RATE.mul(investmentAmount);

    await increaseTimeTo(this.openingTime);
    await this.crowdsale.buyTokens(investor, {
      value: investmentAmount,
      from: investor
    }).should.be.fulfilled;

    (await this.token.balanceOf(investor)).should.be.bignumber.equal(
      expectedTokenAmount
    );
    (await this.token.totalSupply()).should.be.bignumber.equal(
      expectedTokenAmount
    );
  });

  // Sends 1 ETH from owner
  it("should reject payments after end", async function() {
    await increaseTimeTo(this.afterClosingTime);
    await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMRevert);
    await this.crowdsale
      .buyTokens(investor, { value: ether(1), from: investor })
      .should.be.rejectedWith(EVMRevert);
  });

  // Sends 20 ETH from owner
  it("should reject payments over cap", async function() {
    await increaseTimeTo(this.openingTime);
    await this.crowdsale.send(CAP);
    await this.crowdsale.send(1).should.be.rejectedWith(EVMRevert);
  });

  // Sends 10 ETH from owner
  it("should allow finalization and transfer funds to wallet if the goal is reached", async function() {
    await increaseTimeTo(this.openingTime);
    await this.crowdsale.send(GOAL);

    const beforeFinalization = web3.eth.getBalance(wallet);
    await increaseTimeTo(this.afterClosingTime);
    await this.crowdsale.finalize({ from: owner });
    const afterFinalization = web3.eth.getBalance(wallet);

    afterFinalization.minus(beforeFinalization).should.be.bignumber.equal(GOAL);
  });

  // Sends 1 ETH from owner
  it("should allow refunds if the goal is not reached", async function() {
    const balanceBeforeInvestment = web3.eth.getBalance(investor);

    await increaseTimeTo(this.openingTime);
    await this.crowdsale.sendTransaction({
      value: ether(1),
      from: investor,
      gasPrice: 0
    });
    await increaseTimeTo(this.afterClosingTime);

    await this.crowdsale.finalize({ from: owner });
    await this.crowdsale.claimRefund({
      from: investor,
      gasPrice: 0
    }).should.be.fulfilled;

    const balanceAfterRefund = web3.eth.getBalance(investor);
    balanceBeforeInvestment.should.be.bignumber.equal(balanceAfterRefund);
  });

  // Sends 30 ETH from owner
  describe("when goal > cap", function() {
    // goal > cap
    const HIGH_GOAL = ether(30);

    it("creation reverts", async function() {
      await assertRevert(
        SampleCrowdsale.new(
          this.openingTime,
          this.closingTime,
          RATE,
          wallet,
          CAP,
          this.token.address,
          HIGH_GOAL
        )
      );
    });
  });
});

//
//
/* Helper functions replacing imports */
//
//

// import ether from "../helpers/ether";
function ether(n) {
  return new web3.BigNumber(web3.toWei(n, "ether"));
}

// import { advanceBlock } from "../helpers/advanceToBlock";
function advanceBlock() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        id: Date.now()
      },
      (err, res) => {
        return err ? reject(err) : resolve(res);
      }
    );
  });
}

// import { increaseTimeTo, duration } from "../helpers/increaseTime";
function increaseTime(duration) {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [duration],
        id: id
      },
      err1 => {
        if (err1) return reject(err1);

        web3.currentProvider.sendAsync(
          {
            jsonrpc: "2.0",
            method: "evm_mine",
            id: id + 1
          },
          (err2, res) => {
            return err2 ? reject(err2) : resolve(res);
          }
        );
      }
    );
  });
}

function increaseTimeTo(target) {
  let now = latestTime();
  if (target < now)
    throw Error(
      `Cannot increase current time(${now}) to a moment in the past(${target})`
    );
  let diff = target - now;
  return increaseTime(diff);
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

// import latestTime from "../helpers/latestTime";
function latestTime() {
  return web3.eth.getBlock("latest").timestamp;
}

// import EVMRevert from "../helpers/EVMRevert";
const EVMRevert = "revert";

// import assertRevert from "../helpers/assertRevert";
function assertRevert() {
  return async promise => {
    try {
      await promise;
      assert.fail("Expected revert not received");
    } catch (error) {
      const revertFound = error.message.search("revert") >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }
  };
}
