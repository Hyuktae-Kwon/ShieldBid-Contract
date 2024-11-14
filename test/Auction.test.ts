import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Auction } from "../typechain-types/Auction";

describe("Auction", function () {
  async function deployAuctionFeature(productId: string) {
    const signers = await ethers.getSigners();
    const auction = await ethers.deployContract("Auction", [productId]);
    return { auction, signers };
  }

  it("deploys a contract", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    expect(await auction.getAddress()).to.be.properAddress;
  });

  it("has an initial message", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    const product = await auction.getProductId();
    expect(product).to.equal("Desktop");
  });

  it("can get productId, consignorId, and isClosed", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    const product = await auction.getProductId();
    const consignor = await auction.getConsignorId();
    const isClosed = await auction.getIsClosed();

    expect(product).to.equal("Desktop");
    expect(consignor).to.equal(signers[0]);
    expect(isClosed).to.equal(false);
  });

  it("bidders can add new commitments", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    await auction.connect(signers[1]).bid("100");
    const commitment = await auction.getCommitment(signers[1]);
    expect(commitment).to.equal("100");
  });

  it("bidders can get their commitment", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    await auction.connect(signers[1]).bid("100");
    const commitment = await auction.getCommitment(signers[1]);
    expect(commitment).to.equal("100");
  });

  it("only the newest bids are stored", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    await auction.connect(signers[1]).bid("100");
    await auction.connect(signers[1]).bid("200");
    const commitment = await auction.getCommitment(signers[1]);
    expect(commitment).to.equal("200");
  });

  it("consignor cannot make a bid", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    await expect(auction.connect(signers[0]).bid("100")).to.be.reverted;
  });

  it("the consignor can close an auction", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    let isClosed = await auction.getIsClosed();
    expect(isClosed).to.equal(false);
    await auction.closeAuction();
    isClosed = await auction.getIsClosed();
    expect(isClosed).to.equal(true);
  });

  it("only the consignor can close an auction", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    await expect(auction.connect(signers[1]).closeAuction()).to.be.reverted;
  });

  it("bidders cannot make a bid if the auction is closed", async () => {
    const { auction, signers } = await deployAuctionFeature("Desktop");
    await auction.closeAuction();
    await expect(auction.connect(signers[1]).bid("100")).to.be.reverted;
  });
});
