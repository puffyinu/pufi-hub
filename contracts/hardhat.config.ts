import type { HardhatUserConfig } from "hardhat/config";
import toolbox from "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  plugins: [toolbox],
  solidity: "0.8.24",
};

export default config;
