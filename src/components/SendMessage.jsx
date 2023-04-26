/* eslint-disable no-console */
import React from "react";
import { Link } from "react-router-dom";
import { BigNumber, ethers, utils } from "ethers";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { generateProof, verifyProof } from "@semaphore-protocol/proof";
import { SemaphoreEthers, SemaphoreSubgraph } from "@semaphore-protocol/data"

import "font-awesome/css/font-awesome.min.css";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Remove after testing ++++++++++++++++++++++++++++++++++++++++++++++++
const clearCookie = async () => {
  localStorage.clear();
  console.log("Cookies cleared");
  window.location.reload();
};
// Remove after testing ++++++++++++++++++++++++++++++++++++++++++++++++

// Remove after testing ++++++++++++++++++++++++++++++++++++++++++++++++
const checkGroupInfo = async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = queryParams.get("entityID");
  const contract = new ethers.Contract(
    semaphoreCommunitiesAddress,
    SemaphoreCommunitiesABI.abi,
    signer
  );
  const groupMTRoot = await contract.getMerkleTreeRoot(_entityID);
  console.log(`Group MTRoot: ${  groupMTRoot}`);

  const semaphoreSubgraph = new SemaphoreSubgraph("goerli");
  const groupIds = await semaphoreSubgraph.getGroupIds();
  console.log(`Group IDs: ${  groupIds}`);

  const semaphoreEthers = new SemaphoreEthers("goerli", {
    address: process.env.REACT_APP_CONTRACT,
    startBlock: 0
  })
  const members = await semaphoreEthers.getGroupMembers("1")
  console.log(`Group Members: ${  members}`);

  };
  // Remove after testing ++++++++++++++++++++++++++++++++++++++++++++++++


async function signANewMessage() {
  // const queryParams = new URLSearchParams(window.location.search);
  // const _entityID = queryParams.get("entityID");
  // const _entityName = queryParams.get("entityName");
  // const groupToJoin = `identity${  _entityID}`;

  const messageToSign = "zkCommunities";

  const signedData = await signer.signMessage(messageToSign);
  // setSignedMessage(signedData);
  // alert("Signed message: " + signedMessage);

  const { commitment } = new Identity(signedData);
  // alert("New Identity: " + commitment.toString());
  console.log(`New Identity: ${  commitment.toString()}`);
  // const identityInfo = commitment;
  localStorage.setItem("groupToJoin", commitment.toString());
  // console.log(
  //   "Identity now is updated in local storage as: " + localStorage.getItem(groupToJoin)
  // );
}

const submitMessage = async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = parseInt(queryParams.get("entityID"), 10);
  // eslint-disable-next-line no-undef
  console.log(`entityID Value: ${  BigInt(_entityID)}`);
  // console.log(_entityID + " " + _memberCommitment);
  const group = new Group(parseInt(_entityID, 10), 20);
console.log(`Group Members Beginning: ${  group.members}`);
  console.log(`Group root: ${  group.root}`);
  console.log(`Group size: ${  group.depth}`);

  // const externalNullifier = utils.formatBytes32String("Topic");
  const externalNullifier = group.root;
  const signal = document.getElementById("leakMessage").value;
  const _leakMessage = BigNumber.from(utils.formatBytes32String(signal)).toString();
  console.log(`localStorage.getItem(signedData): ${  localStorage.getItem("signedData")}`);
  const identity = new Identity(localStorage.getItem("signedData"));
  console.log(`identity.commitment: ${  identity.commitment}`);
  group.addMember(identity.commitment);
  const idIndex = group.indexOf(identity.commitment);
  console.log(`idIndex: ${  idIndex}`);
  console.log(`Group Members: ${  group.members}`);

  const groupProof = group.generateMerkleProof(idIndex);
    console.log(`groupProof leaf: ${  groupProof.leaf}`);
    console.log(`groupProof root: ${  groupProof.root}`);
    console.log(`_entityID: ${  _entityID}`);

    console.log("******* Group Info: *********************************");
    console.log(`GroupID: ${  group.id}`);
    console.log(`Group Root: ${  group.root}`);
    console.log(`Group Depth: ${  group.depth}`);
    console.log(`Group zeroValue: ${  group.zeroValue}`);
    const thisIdsGroupMerkleProof = group.generateMerkleProof(idIndex)
    console.log(`Group MerkleProof Leaf: ${  thisIdsGroupMerkleProof.leaf}`);
    console.log(`Group MerkleProof Root: ${  thisIdsGroupMerkleProof.root}`);
    console.log("*******  End of Group Info *********************************");

   
    await provider.send("eth_requestAccounts", []);
        const contract = new ethers.Contract(
      semaphoreCommunitiesAddress,
      SemaphoreCommunitiesABI.abi,
      signer
    );

    const groupMTRoot = await contract.getMerkleTreeRoot(_entityID);
    console.log(`GroupMTRoot: ${  groupMTRoot}`);
    console.log(`Raw is: ${  typeof groupMTRoot}`);
      // eslint-disable-next-line no-undef
    const groupMTRootInt = BigInt(groupMTRoot);
    console.log(`Int is: ${  typeof groupMTRootInt}`);
    const groupMTDepth = await contract.getMerkleTreeDepth(_entityID);
    console.log(`GroupMTDepth: ${  groupMTDepth}`);
    

    console.log("******* Generating Proof With: *********************************");
    console.log(`identity: ${  identity}`);
    console.log(`thisIdsGroupMerkleProof: ${  thisIdsGroupMerkleProof }`);
    console.log(`externalNullifier: ${  externalNullifier}`);
    console.log(`_leakMessage: ${  _leakMessage}`);
    console.log("*******  End of Generating Proof With: *********************************");


    const fullProof = await generateProof(
      identity,
      group,
      _entityID,
      _leakMessage
  )

  console.log(`fullProof: ${ fullProof.proof }`);

const vProof = await verifyProof(fullProof, 20);
console.log(`vProof: ${  vProof}`);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nonce = await signer.getTransactionCount();

  console.log("******* Publishing Leak With: *********************************");
  console.log(`_leakMessage: ${  _leakMessage}`);
  console.log(`nullifierHash: ${  fullProof.nullifierHash}`);
  console.log(`_entityID: ${  _entityID  } ${  typeof _entityID}`);
  console.log(`proof: ${  fullProof.proof}`);
  console.log("*******  End of Publishing Leak With: *********************************");

  const tx = await contract.publishLeak(
    _leakMessage,
    fullProof.merkleTreeRoot,
    fullProof.nullifierHash,
    fullProof.proof, { gasLimit: 1000000, nonce: nonce || undefined }
  );

  console.log("Success!");
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
  document.getElementById("leakMessage").value = "";
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);
};

const sendMessage = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const groupName = queryParams.get("entityName");

  console.log(
    `Identity now in local storage is: ${  localStorage.getItem("groupToJoin")}`
  );

  return (
    <div>
      <h1>Send Message</h1>
      <p>
        <Link to="/AllGroups">All Groups</Link> |{" "}
        <Link to="/CreateGroup">Create Group</Link>
      </p>

      {/* <p>Send Message to {groupName} Group: </p> */}

      <div
        id="sendMessageForm"
        className="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin"
      >
        <h2 className="w3-center">Send Message to '{groupName}' Group: </h2>

        <div className="w3-row w3-section">
          <div className="w3-col" style={{ width: `${50  }px` }}>
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
        <button
          onClick={signANewMessage}
          className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
        >
          Sign Message
        </button>
        <button
          onClick={checkGroupInfo}
          className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
        >
          Verify Group Info
        </button>
        <button
          onClick={clearCookie}
          className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
        >
          Clear Cookies
        </button>

      </div>
    </div>
  );
};

export default sendMessage;
