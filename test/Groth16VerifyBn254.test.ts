import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Groth16VerifyBn254 } from "../typechain-types/Groth16VerifyBn254";
import { vk } from "./jsons/vk.json";
import { proof } from "./jsons/proof.json";
import { verify_inputs } from "./jsons/verify_inputs.json";

const vkStruct: Groth16VerifyBn254.VerifyingKeyStruct = {
  alpha1: { X: vk[0], Y: vk[1] },
  beta2: {
    X: [vk[2], vk[3]],
    Y: [vk[4], vk[5]],
  },
  gamma2: {
    X: [vk[6], vk[7]],
    Y: [vk[8], vk[9]],
  },
  delta2: {
    X: [vk[10], vk[11]],
    Y: [vk[12], vk[13]],
  },
  public_input: Array.from({ length: 13 }, (_, i) => ({
    X: vk[14 + i * 2],
    Y: vk[15 + i * 2],
  })),
};

describe("SNARK", function () {
  async function deployGrothFeature() {
    const [owner] = await ethers.getSigners();
    const groth = await ethers.deployContract("Groth16VerifyBn254");
    return { groth, owner };
  }

  it("Should return true", async () => {
    const { groth } = await loadFixture(deployGrothFeature);
    expect(await groth.verifyProof(proof, verify_inputs, vkStruct)).to.equal(
      true
    );
  });
});
