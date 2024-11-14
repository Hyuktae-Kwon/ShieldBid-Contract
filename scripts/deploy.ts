import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const Groth16VerifyBn254 = await ethers.getContractFactory(
    "Groth16VerifyBn254"
  );
  const groth = await Groth16VerifyBn254.deploy();

  console.log(`Groth verification deployed to: ${await groth.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
