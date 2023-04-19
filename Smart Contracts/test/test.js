/* eslint-disable jest/valid-expect */
const { Group } = require("@semaphore-protocol/group");
const { Identity } = require("@semaphore-protocol/identity");
const { FullProof, generateProof } = require("@semaphore-protocol/proof");
const { Signer, utils } = require("ethers");
const { expect } = require("chai");
const { ethers, run } = require("hardhat");
const { SemaphoreCommunities } = "../Contracts/";
const { Pairing } = "../Contracts/";

const poseidonContract = require("circomlibjs").poseidon_gencontract;

describe("SemaphoreCommunities", () => {
  let semaphoreCommunitiesContract
  let pairingContract
  let accounts
  let editor

  const treeDepth = Number(process.env.TREE_DEPTH) || 20
  const entityIds = [1, 2]

  const wasmFilePath = `https://www.trusted-setup-pse.org/semaphore/${treeDepth}/semaphore.wasm`
  const zkeyFilePath = `https://www.trusted-setup-pse.org/semaphore/${treeDepth}/semaphore.zkey`


    before(async () => {

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

      semaphoreCommunitiesContract = contract;


    // const { semaphoreCommunities, pairingAddress } = await run(
    //   "deploy:semaphore-communities", {
    //     logs: false
    //   }
    // )

    // semaphoreCommunitiesContract = semaphoreCommunities
    // const pairingAddress = contract.address;
    // // pairingContract = await ethers.getContractAt("Pairing", pairingAddress)
    // const PairingTest = await ethers.getContractFactory("Pairing");
    // const pairingContract = await PairingTest.deploy();

    accounts = await ethers.getSigners()
    editor = await accounts[1].getAddress()
  })

  describe("# createGroup", () => {
    it("Should not create an entity with a wrong depth", async () => {
      const transaction = semaphoreCommunitiesContract.createGroup(
        entityIds[0], editor, 10
      )

      await expect(transaction).to.be.revertedWithCustomError(
        semaphoreCommunitiesContract,
        "Semaphore__MerkleTreeDepthIsNotSupported"
      )
    })

    it("Should create an entity", async () => {
      const transaction = semaphoreCommunitiesContract.createEntity(
        entityIds[0], editor, treeDepth
      )

      await expect(transaction)
        .to.emit(semaphoreCommunitiesContract, "EntityCreated")
        .withArgs(entityIds[0], editor)
    })

    it("Should not create a entity if it already exists", async () => {
      const transaction = semaphoreCommunitiesContract.createEntity(
        entityIds[0], editor, treeDepth
      )

      await expect(transaction).to.be.revertedWithCustomError(
        semaphoreCommunitiesContract,
        "Semaphore__GroupAlreadyExists"
      )
    })
  })

  describe("# addWhistleblower", () => {
    it("Should not add a whistleblower if the caller is not the editor", async () => {
      const { commitment } = new Identity()

      const transaction = semaphoreCommunitiesContract.addWhistleblower(
        entityIds[0], commitment
      )

      await expect(transaction).to.be.revertedWithCustomError(
        semaphoreCommunitiesContract,
        "Semaphore__CallerIsNotTheEditor"
      )
    })

    it("Should add a whistleblower to an existing entity", async () => {
      const { commitment } = new Identity("test")
      const group = new Group(entityIds[0], treeDepth)

      group.addMember(commitment)

      const transaction = semaphoreCommunitiesContract
        .connect(accounts[1])
        .addWhistleblower(entityIds[0], commitment)

      await expect(transaction)
        .to.emit(semaphoreCommunitiesContract, "MemberAdded")
        .withArgs(entityIds[0], 0, commitment, group.root)
    })

    it("Should return the correct number of whistleblowers of an entity", async () => {
      const size =
        await semaphoreCommunitiesContract.getNumberOfMerkleTreeLeaves(entityIds[0])

      expect(size).to.be.eq(1)
    })
  })

  describe("# removeWhistleblower", () => {
    it("Should not remove a whistleblower if the caller is not the editor", async () => {
      const { commitment } = new Identity()
      const group = new Group(entityIds[0], treeDepth)

      group.addMember(commitment)

      const { siblings, pathIndices } = group.generateMerkleProof(0)

      const transaction = semaphoreCommunitiesContract.removeWhistleblower(
        entityIds[0], commitment, siblings, pathIndices
      )

      await expect(transaction).to.be.revertedWithCustomError(
        semaphoreCommunitiesContract,
        "Semaphore__CallerIsNotTheEditor"
      )
    })

    it("Should remove a whistleblower from an existing entity", async () => {
      const { commitment } = new Identity("test")
      const group = new Group(entityIds[0], treeDepth)

      group.addMember(commitment)

      const { siblings, pathIndices } = group.generateMerkleProof(0)

      group.removeMember(0)

      const transaction = semaphoreCommunitiesContract
        .connect(accounts[1])
        .removeWhistleblower(entityIds[0], commitment, siblings, pathIndices)

      await expect(transaction)
        .to.emit(semaphoreCommunitiesContract, "MemberRemoved")
        .withArgs(entityIds[0], 0, commitment, group.root)
    })
  })

  describe("# publishLeak", () => {
    const identity = new Identity("test")
    const leak = utils.formatBytes32String("This is a leak")

    const group = new Group(entityIds[1], treeDepth)

    group.addMembers([identity.commitment, BigInt(1)])

    let fullProof

    before(async () => {
      await semaphoreCommunitiesContract.createEntity(
        entityIds[1], editor, treeDepth
      )

      await semaphoreCommunitiesContract
        .connect(accounts[1])
        .addWhistleblower(entityIds[1], identity.commitment)

      await semaphoreCommunitiesContract
        .connect(accounts[1]).addWhistleblower(entityIds[1], BigInt(1))

      fullProof = await generateProof(identity, group, entityIds[1], leak, {
        wasmFilePath,
        zkeyFilePath
      })
    })

    it("Should not publish a leak if the proof is not valid", async () => {
      const transaction = semaphoreCommunitiesContract
        .connect(accounts[1])
        .publishLeak(leak, 0, entityIds[1], fullProof.proof)

      await expect(transaction).to.be.revertedWithCustomError(
        pairingContract,
        "InvalidProof"
      )
    })

    it("Should publish a leak", async () => {
      const transaction = semaphoreCommunitiesContract
        .connect(accounts[1])
        .publishLeak(leak, fullProof.nullifierHash, entityIds[1], fullProof.proof)

      await expect(transaction)
        .to.emit(semaphoreCommunitiesContract, "LeakPublished")
        .withArgs(entityIds[1], leak)
    })
  })
})