import React from "react";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";
import "font-awesome/css/font-awesome.min.css";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress =
  "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Remove after testing ++++++++++++++++++++++++++++++++++++++++++++++++
const clearCookie = async () => {
  localStorage.clear();
  console.log("Cookies cleared");
  window.location.reload();
};
// Remove after testing ++++++++++++++++++++++++++++++++++++++++++++++++

async function signANewMessage() {
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = queryParams.get("entityID");
  const _entityName = queryParams.get("entityName");
  const groupToJoin = "identity" + _entityID;

  const messageToSign = "zkCommunities";

  const signedData = await signer.signMessage(messageToSign);
  //setSignedMessage(signedData);
  //alert("Signed message: " + signedMessage);

  const { commitment } = new Identity(signedData);
  alert("New Identity: " + commitment.toString());
  console.log("New Identity: " + commitment.toString());
  //const identityInfo = commitment;
  localStorage.setItem("groupToJoin", commitment.toString());
  // console.log(
  //   "Identity now is updated in local storage as: " + localStorage.getItem(groupToJoin)
  // );
}

const submitMessage = async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = queryParams.get("entityID");
  // console.log(_entityID + " " + _memberCommitment);
  const group = new Group(_entityID);
  const externalNullifier = utils.formatBytes32String("Topic");
  const signal = document.getElementById("leakMessage").value;
  const _leakMessage = utils.formatBytes32String(signal);
  //   const { trapdoor, nullifier, commitment } = new Identity(
  //     localStorage.getItem("signedData")
  //   );
  const identity = new Identity(localStorage.getItem("signedData"));

  group.addMember(identity.commitment);
  const fullProof = await generateProof(
    identity,
    group,
    externalNullifier,
    _leakMessage
  );
  console.log("fullProof: " + fullProof.proof);

  let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(
    semaphoreCommunitiesAddress,
    SemaphoreCommunitiesABI.abi,
    signer
  );

  let nonce = await signer.getTransactionCount();

  const tx = await contract.publishLeak(
    _leakMessage,
    identity.nullifier,
    _entityID,
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
    "Identity now in local storage is: " + localStorage.getItem("groupToJoin")
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
          <div className="w3-col" style={{ width: 50 + "px" }}>
            {/* <i className="fa" className="w3-col"></i> */}
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
          onClick={signANewMessage}
          className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
        >
          Sign Message
        </button>
        <button
          onClick={clearCookie}
          className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
        >
          Clear Cookies
        </button>
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
