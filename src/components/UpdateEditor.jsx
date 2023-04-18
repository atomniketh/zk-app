import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress =
  "0x33F97669eD732Fa05924015863772118C9D4e236";

async function updateEditor() {
  const queryParams = new URLSearchParams(window.location.search);
  const _index = queryParams.get("index");
  const _entityID = queryParams.get("entityID");
  const _newEditor = document.getElementById("newEditorAddress").value;

  let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(
    semaphoreCommunitiesAddress,
    SemaphoreCommunitiesABI.abi,
    signer
  );
  const tx = await contract.updateGroupEditor(_index, _newEditor, _entityID);
    // console.log("Success!");
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
  document.getElementById("updateEditorForm").reset();
  // const receipt = await tx.wait();
    // console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    // console.log(`Gas used: ${receipt.gasUsed.toString()}`);
}

const UpdateEditor = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const entityCurrentEditor = queryParams.get("entityEditor");
  // console.log("Name is now: " + entityNameCurrent);
  return (
    <div>
      <h1>Update Editor Page</h1>
      <br />
      <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link>{" "}
      | <Link to="/OffchainGroups">Off-Chain Groups</Link> |{" "}
      <Link to="/Messages">Messages</Link> |{" "}
      <Link to="/SendFeedback">Send Feedback</Link> |{" "}
      <Link to="/AllGroups">All Groups</Link> |{" "}
      <Link to="/CreateGroup">Create Group</Link>
      <p>Current Editor Address: {entityCurrentEditor} </p>
      <form id="updateEditorForm">
        <label htmlFor="newEditorAddress">New Editor Address:</label> &nbsp;
        <input type="text" id="newEditorAddress" name="newEditorAddress" size="50" />
        <p></p>
      </form>
      <p>
        <button type="button" onClick={updateEditor} className="w3-button w3-white w3-border w3-border-red w3-round-large">
          Click here to update Editor Address.
        </button>
      </p>
    </div>
  );
};

export default UpdateEditor;