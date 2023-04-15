import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress =
  "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";

async function updateGroupName() {
  const queryParams = new URLSearchParams(window.location.search);
  const _index = queryParams.get("index");
  const _entityID = queryParams.get("entityID");
  const newGroupName = document.getElementById("newGroupName").value;

  let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(
    semaphoreCommunitiesAddress,
    SemaphoreCommunitiesABI.abi,
    signer
  );
  const tx = await contract.updateGroupName(_index, newGroupName, _entityID);
  //   console.log("Success!");
    console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
  document.getElementById("updateGroupNameForm").reset();
  //   const receipt = await tx.wait();
  //   console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  //   console.log(`Gas used: ${receipt.gasUsed.toString()}`);
}

const UpdateGroupName = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const entityNameCurrent = queryParams.get("entityName");
  // console.log("Name is now: " + entityNameCurrent);
  return (
    <div>
      <h1>Update Group Name Page</h1>
      <br />
      <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link>{" "}
      | <Link to="/OffchainGroups">Off-Chain Groups</Link> |{" "}
      <Link to="/Messages">Messages</Link> |{" "}
      <Link to="/SendFeedback">Send Feedback</Link> |{" "}
      <Link to="/AllGroups">All Groups</Link> |{" "}
      <Link to="/CreateGroup">Create Group</Link>
      <p>Current Group Name: {entityNameCurrent} </p>
      <form id="updateGroupNameForm">
        <label htmlFor="newGroupName">New Group Name:</label> &nbsp;
        <input type="text" id="newGroupName" name="newGroupName" size="30" />
        <p></p>
      </form>
      <p>
        <button type="button" onClick={updateGroupName} class="w3-button w3-white w3-border w3-border-red w3-round-large">
          Click here to update Group Name.
        </button>
      </p>
    </div>
  );
};

export default UpdateGroupName;