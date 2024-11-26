import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Auction } from "../typechain-types/Auction";

const consignorID = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

describe("Auction", function () {
  async function deployAuctionFeature(productId: string, consignorId: string) {
    const signers = await ethers.getSigners();
    const auction = await ethers.deployContract("Auction", [
      productId,
      consignorId,
    ]);
    return { auction, signers };
  }

  it("deploys a contract", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    expect(await auction.getAddress()).to.be.properAddress;
  });

  it("has an initial message", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    const product = await auction.getProductId();
    expect(product).to.equal("Desktop", consignorID);
  });

  it("can get productId, consignorId, and isClosed", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    const product = await auction.getProductId();
    const consignor = await auction.getConsignorId();
    const isClosed = await auction.getIsClosed();

    expect(product).to.equal("Desktop", consignorID);
    expect(consignor).to.equal(signers[0]);
    expect(isClosed).to.equal(false);
  });

  it("bidders can add new commitments", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    await auction.connect(signers[1]).bid("100");
    const commitment = await auction.getCommitment(signers[1]);
    expect(commitment).to.equal("100");
  });

  it("bidders can get their commitment", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    await auction.connect(signers[1]).bid("100");
    const commitment = await auction.getCommitment(signers[1]);
    expect(commitment).to.equal("100");
  });

  it("only the newest bids are stored", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    await auction.connect(signers[1]).bid("100");
    await auction.connect(signers[1]).bid("200");
    const commitment = await auction.getCommitment(signers[1]);
    expect(commitment).to.equal("200");
  });

  it("consignor cannot make a bid", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    await expect(auction.connect(signers[0]).bid("100")).to.be.reverted;
  });

  it("the consignor can close an auction", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    let isClosed = await auction.getIsClosed();
    expect(isClosed).to.equal(false);
    await auction.closeAuction();
    isClosed = await auction.getIsClosed();
    expect(isClosed).to.equal(true);
  });

  it("only the consignor can close an auction", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    await expect(auction.connect(signers[1]).closeAuction()).to.be.reverted;
  });

  it("bidders cannot make a bid if the auction is closed", async () => {
    const { auction, signers } = await deployAuctionFeature(
      "Desktop",
      consignorID
    );
    await auction.closeAuction();
    await expect(auction.connect(signers[1]).bid("100")).to.be.reverted;
  });
});
