import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0,
      gasPrice: 0,
      blockGasLimit: 3000000000,
      allowUnlimitedContractSize: true,
    },
  },
};

export default config;
