const poseidonContract = require("circomlibjs").poseidon_gencontract;
const { Contract } = require("ethers");
const { task, types } = require("hardhat/config");
const hre = require("hardhat");

async function main() {

      const poseidonT3ABI = poseidonContract.generateABI(2);
      const poseidonT3Bytecode = poseidonContract.createCode(2);

      const [signer] = await hre.ethers.getSigners();

      const PoseidonLibT3Factory = new hre.ethers.ContractFactory(
        poseidonT3ABI,
        poseidonT3Bytecode,
        signer
      );
      const poseidonT3Lib = await PoseidonLibT3Factory.deploy();

      await poseidonT3Lib.deployed();

        console.log(
          "PoseidonT3 library has been deployed to: " + poseidonT3Lib.address
        );

      const IncrementalBinaryTreeLibFactory = await hre.ethers.getContractFactory(
        "IncrementalBinaryTree",
        {
          libraries: {
            PoseidonT3: poseidonT3Lib.address,
          },
        }
      );
      const incrementalBinaryTreeLib =
        await IncrementalBinaryTreeLibFactory.deploy();

      await incrementalBinaryTreeLib.deployed();

        console.log(
          "IncrementalBinaryTree library has been deployed to: " + incrementalBinaryTreeLib.address
        );

      const SemaphoreCommunitiesFactory = await hre.ethers.getContractFactory(
        "SemaphoreCommunities",
        {
          libraries: {
            IncrementalBinaryTree: incrementalBinaryTreeLib.address,
          },
        }
      );

      const contract = await SemaphoreCommunitiesFactory.deploy(
        "0xb908Bcb798e5353fB90155C692BddE3b4937217C"
      );

      await contract.deployed();

        console.log(
          "SemaphoreCommunities contract has been deployed to: " + contract.address
        );

      return contract;
    }
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });