require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-toolbox");
require("@semaphore-protocol/hardhat");

const ALCHEMY_API_KEY = "vco-hPqqUMcdREoYEbIbd4PhVSBT0MJ7";
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// npx hardhat verify --network goerli 0x33F97669eD732Fa05924015863772118C9D4e236 "0xb908Bcb798e5353fB90155C692BddE3b4937217C"

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  etherscan: {
    apiKey: "FWXKQHRR3NIEZ7U7K6NJ64X6YB96IMS868"
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.ETHEREUM_PRIVATE_KEY}`]
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/vco-hPqqUMcdREoYEbIbd4PhVSBT0MJ7`,
      chainid: 5,
      accounts: [`0x${process.env.ETHEREUM_PRIVATE_KEY}`]
    }
}
};

// const contractFactory = await this.env.ethers.getContractFactory("Example", {
//   libraries: {
//     ExampleLib: "0x...",
//   },
// });