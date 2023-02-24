import '@oasisprotocol/sapphire-hardhat';
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    emerald_local: {
      url: "http://localhost:8545",
      accounts:
        process.env.PRIVATE_KEYS?.split(','),
    },
    emerald_testnet: {
      url: "https://testnet.emerald.oasis.dev",
      accounts:
        process.env.PRIVATE_KEYS?.split(','),
    },
    emerald_mainnet: {
      url: "https://emerald.oasis.dev",
      accounts:
        process.env.PRIVATE_KEYS?.split(','),
    },
    sapphire_testnet: {
      url: "https://testnet.sapphire.oasis.dev",
      accounts: process.env.PRIVATE_KEYS?.split(','),
      chainId: 0x5aff,
    }
  },
  mocha: {
    timeout: 60000
  }
};

export default config;
