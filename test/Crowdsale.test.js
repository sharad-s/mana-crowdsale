const ether = n => {
  return new web3.BigNumber(web3.toWei(n, "ether"));
};

const BigNumber = web3.BigNumber;

const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

const Crowdsale = artifacts.require("MANACrowdsale");
const SimpleBundleToken = artifacts.require("BundleToken");
const SimpleMANAToken = artifacts.require("MANAToken");

contract("Crowdsale", function([_, investor, wallet, purchaser]) {
  const rate = new BigNumber(1);
  const value = ether(42);
  const tokenSupply = new BigNumber("1e22");
  const expectedTokenAmount = rate.mul(value);

  // let manaAddress = accounts[1];

  before(async function() {
    BundleToken = await SimpleBundleToken.new(tokenSupply);
    MANAToken = await SimpleMANAToken.new(tokenSupply);
    MANACrowdsale = await Crowdsale.new(rate, wallet, BundleToken.address);
    await BundleToken.transfer(MANACrowdsale.address, 10000, { from: _ });
  });

  context("MANAToken", async () => {
    it("test", async () => {
      assert(1 == 1);
    });

    it("should have a total supply", async () => {
      let totalSupply = await this.MANAToken.totalSupply();
      console.log("Total Supply:", totalSupply["c"]);
      // should.exist(totalSupply);
    });

    it("should have a name & symbol", async () => {
      let name = await this.MANAToken.name();
      let symbol = await this.MANAToken.symbol();
      // console.log(name, symbol);
      should.exist(name && symbol);
    });
  });

  context("BundleToken", async () => {
    it("test", async () => {
      // console.log(this);
      assert(1 == 1);
    });

    it("should have a total supply", async () => {
      let totalSupply = await this.BundleToken.totalSupply();
      console.log("Total Supply:", totalSupply["c"]);
      // should.exist(totalSupply);
    });

    it("should have a name & symbol", async () => {
      let name = await this.BundleToken.name();
      let symbol = await this.BundleToken.symbol();
      // console.log(name, symbol);
      should.exist(name && symbol);
    });
  });

  context("Crowdsale", async () => {
    it("test", async () => {
      assert(1 == 1);
    });

    it("should have an address", async () => {
      let address = await this.MANACrowdsale.address;
      // console.log(address);
      should.exist(address);
    });

    it("should accept payments", async () => {
      await this.MANACrowdsale.send(value).should.be.fulfilled;
    });
  });

  // describe("accepting payments", function() {
  //   it("should accept payments", async function() {
  //     await this.crowdsale.send(value).should.be.fulfilled;
  //     await this.crowdsale.buyTokens(investor, {
  //       value: value,
  //       from: purchaser
  //     }).should.be.fulfilled;
  //   });
  // });

  // describe("high-level purchase", function() {
  //   it("should log purchase", async function() {
  //     const { logs } = await this.crowdsale.sendTransaction({
  //       value: value,
  //       from: investor
  //     });
  //     const event = logs.find(e => e.event === "TokenPurchase");
  //     should.exist(event);
  //     event.args.purchaser.should.equal(investor);
  //     event.args.beneficiary.should.equal(investor);
  //     event.args.value.should.be.bignumber.equal(value);
  //     event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
  //   });

  //   it("should assign tokens to sender", async function() {
  //     await this.crowdsale.sendTransaction({ value: value, from: investor });
  //     let balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(expectedTokenAmount);
  //   });
  //
  //   it("should forward funds to wallet", async function() {
  //     const pre = web3.eth.getBalance(wallet);
  //     await this.crowdsale.sendTransaction({ value, from: investor });
  //     const post = web3.eth.getBalance(wallet);
  //     post.minus(pre).should.be.bignumber.equal(value);
  //   });
  // });

  // describe("low-level purchase", function() {
  //   it("should log purchase", async function() {
  //     const { logs } = await this.crowdsale.buyTokens(investor, {
  //       value: value,
  //       from: purchaser
  //     });
  //     const event = logs.find(e => e.event === "TokenPurchase");
  //     should.exist(event);
  //     event.args.purchaser.should.equal(purchaser);
  //     event.args.beneficiary.should.equal(investor);
  //     event.args.value.should.be.bignumber.equal(value);
  //     event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
  //   });
  //
  //   it("should assign tokens to beneficiary", async function() {
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     const balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(expectedTokenAmount);
  //   });
  //
  //   it("should forward funds to wallet", async function() {
  //     const pre = web3.eth.getBalance(wallet);
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     const post = web3.eth.getBalance(wallet);
  //     post.minus(pre).should.be.bignumber.equal(value);
  //   });
  // });
});
