import { ethers } from "hardhat";
import { auction_id, consignor_id } from "../test/jsons/create_auction.json";

async function main(auction_id: string, _consignorId: string) {
  const [deployer] = await ethers.getSigners();
  const Auction = await ethers.getContractFactory("Auction");
  const auction = await Auction.deploy(auction_id, _consignorId);

  console.log(`Auction deployed to: ${await auction.getAddress()}`);
}

main(auction_id, consignor_id)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
