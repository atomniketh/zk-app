/* eslint-disable no-console */
import React from "react";
import { Link } from "react-router-dom";
import { ethers, utils, BigNumber } from "ethers";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { generateProof, verifyProof } from "@semaphore-protocol/proof";
import { SemaphoreEthers } from "@semaphore-protocol/data"
import "font-awesome/css/font-awesome.min.css";
import SemaphoreContractABI from "../abi/Semaphore.json";

const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK);
const semaphoreContractAddress = process.env.REACT_APP_SEMAPHORE;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const submitMessage = async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = parseInt(queryParams.get("entityID"), 10);
  const _entityIDStr = queryParams.get("entityID");
  // eslint-disable-next-line no-undef
  const group = new Group(parseInt(_entityID, 10), 20);
  const signal = BigNumber.from(utils.formatBytes32String(document.getElementById("leakMessage").value)).toString();

  // console.log("Formatted Signal: " + signal);
  // console.log(`localStorage.getItem(signedData): ${localStorage.getItem("signedData")}`);
  const identity = new Identity(localStorage.getItem("signedData"));

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 12; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const externalNullifier = utils.formatBytes32String(randomString);
  // console.log(`random string: ${result}`);
  // console.log(`externalNullifer: ${externalNullifier}`);

  const allMembers = await semaphoreEthers.getGroupMembers(_entityIDStr);
  group.addMembers(allMembers);
  // console.log(`allMembers: ${allMembers}`);

  const idIndex = group.indexOf(identity.commitment);
  // console.log(`idIndex: ${idIndex}`);
  // console.log(`Group Members: ${group.members}`);

  // const groupProof = group.generateMerkleProof(idIndex);
  const thisIdsGroupMerkleProof = group.generateMerkleProof(idIndex)

  // console.log(`groupProof leaf: ${groupProof.leaf}`);
  // console.log(`groupProof root: ${groupProof.root}`);
  // console.log(`_entityID: ${_entityID}`);

  // console.log("******* Group Info: *********************************");
  // console.log(`GroupID: ${group.id}`);
  // console.log(`Group Root: ${group.root}`);
  // console.log(`Group Depth: ${group.depth}`);
  // console.log(`Group zeroValue: ${group.zeroValue}`);
  // console.log(`Group MerkleProof: ${thisIdsGroupMerkleProof}`);
  // console.log(`Group MerkleProof Leaf: ${thisIdsGroupMerkleProof.leaf}`);
  // console.log(`Group MerkleProof Root: ${thisIdsGroupMerkleProof.root}`);
  // console.log("*******  End of Group Info *********************************");

  await provider.send("eth_requestAccounts", []);
  const contract = new ethers.Contract(
    semaphoreContractAddress,
    SemaphoreContractABI.abi,
    signer
  );

  const groupMTRoot = await contract.getMerkleTreeRoot(_entityID);
  // console.log(`GroupMTRoot from on-chain: ${groupMTRoot}`);

  if (groupMTRoot == thisIdsGroupMerkleProof.root) {
    console.log('The Roots match, message can be sent.')
  } else {
    console.log('The Roots DO NOT match, message can not be sent.')
  }

  // console.log(`Raw is: ${typeof groupMTRoot}`);
  // eslint-disable-next-line no-undef
  // const groupMTRootInt = BigInt(groupMTRoot);
  // console.log(`Int is: ${typeof groupMTRootInt}`);
  // const groupMTDepth = await contract.getMerkleTreeDepth(_entityID);
  // console.log(`GroupMTDepth: ${groupMTDepth}`);

  // console.log("******* Generating Proof With: *********************************");
  // console.log(`identity: ${identity}`);
  // console.log(`thisIdsGroupMerkleProof: ${thisIdsGroupMerkleProof}`);
  // console.log(`externalNullifier: ${externalNullifier}`);
  // console.log(`signal: ${signal}`);
  // console.log("*******  End of Generating Proof With: *********************************");

  const fullProof = await generateProof(
    identity,
    group,
    externalNullifier,
    signal
  )

  const vProof = await verifyProof(fullProof, 20);
  // console.log(`Verified Proof: ${vProof}`);

  if (vProof) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const nonce = await signer.getTransactionCount();

    console.log("******* Publishing Signal With: *********************************");
    console.log(`groupId: ${_entityID}`);
    console.log(`thisIdsGroupMerkleProof.root: ${thisIdsGroupMerkleProof.root}`);
    console.log(`Which matches GroupMTRoot from on-chain: ${groupMTRoot}`);
    console.log(`Proofs merkleTreeRoot: ${fullProof.merkleTreeRoot}`);
    console.log(`signal: ${signal}`);
    console.log(`fullProof.nullifierHash: ${fullProof.nullifierHash}`);
    console.log(`externalNullifier: ${externalNullifier}`);
    console.log(`fullProof.proof: ${fullProof.proof}`);
    console.log("*******  End of Publishing Leak With: *********************************");

    const tx = await contract.verifyProof(_entityID, thisIdsGroupMerkleProof.root, signal, fullProof.nullifierHash, externalNullifier, fullProof.proof, { gasLimit: 1000000, nonce: nonce || undefined })
    console.log("Success!");
    console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
    document.getElementById("leakMessage").value = "";
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
  } else {
    console.log("Proof was not verified. Cannot send message.")
  }
};

const sendMessage = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const groupName = queryParams.get("entityName");

  // console.log(
  //   `Identity now in local storage is: ${localStorage.getItem("groupToJoin")}`
  // );

  if (localStorage.getItem("groupToJoin") === null) {
    console.log(`Identity is null`);
  } else {
    console.log(
      `Identity is stored as: ${localStorage.getItem("groupToJoin")}`
    );
  }

  return (
    <div>
      <h1>Send Message</h1>
      <p>
        <Link to="/AllGroups">All Groups</Link>
      </p>

      {/* <p>Send Message to {groupName} Group: </p> */}

      <div
        id="sendMessageForm"
        className="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin"
      >
        <h2 className="w3-center">Send Message to '{groupName}' Group: </h2>

        <div className="w3-row w3-section">
          <div className="w3-col" style={{ width: `${50}px` }}>
            <i className="w3-xxlarge fa fa-envelope-o"></i>
          </div>
          <div className="w3-rest">
            <textarea
              className="w3-input w3-border"
              id="leakMessage"
              name="leakMessage"
              rows="4"
              cols="50"
            />
          </div>{" "}
        </div>
        <button
          onClick={submitMessage}
          className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
        >
          Submit Message
        </button>
      </div>
    </div>
  );
};

export default sendMessage;