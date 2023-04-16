import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from '../abi/SemaphoreCommunities.json';

const semaphoreCommunitiesAddress = "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";

async function checkEditor() {
    // check if user is the group editor
    const queryParams = new URLSearchParams(window.location.search);
    const _entityID = queryParams.get("entityID");
    const _entityEditor = queryParams.get("entityEditor");
    let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let isEditor = false;
    if (await signer.getAddress() === _entityEditor) {
        isEditor = true;
        console.log("You are the editor of the group: " + _entityID);
    } else {
        isEditor = false;
        console.log("You are not the editor of the group: " + _entityID);
        alert("You are not the editor of the group: " + _entityID);
    }
}

async function addMemberToGroup() {
        const _memberCommitment = document.getElementById("memberCommitment").value;
        const queryParams = new URLSearchParams(window.location.search);
        const _entityID = queryParams.get("entityID");
        console.log(_entityID + " " + _memberCommitment);

      let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        semaphoreCommunitiesAddress,
        SemaphoreCommunitiesABI.abi,
        signer
      );
      const tx = await contract.addWhistleblower(_entityID, _memberCommitment);
      console.log("Success!");
      console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
      document.getElementById("addMemberForm").reset();
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    }

const addMember = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const groupName = queryParams.get("entityName");

    return (
      <div>
        <h1>Add Member to Group</h1>
        <br />
        <Link to="/">Identities</Link> |{" "} <Link to="/Groups">On-Chain Groups</Link> |{" "} <Link to="/OffchainGroups">Off-Chain Groups</Link> |{" "} <Link to="/Messages">Messages</Link> |{" "} <Link to="/SendFeedback">Send Feedback</Link> |{" "} 
        <p><Link to="/AllGroups">All Groups</Link> |{" "} <Link to="/CreateGroup">Create Group</Link></p>
        <p>Add Member to {groupName} Group: </p>

        <form id="addMemberForm">
            {/* <input type="hidden" id="entityID" name="entityID" value={queryParams.get("entityID")} /> */}
            <label htmlFor="memberCommitment">Commitment:</label> &nbsp;
            <input type="text" id="memberCommitment" name="memberCommitment" size="90" />
          <p></p>
        </form>

        <p>
          <button type="button" onClick={checkEditor}>
            Click here to Check if the editor is you.
          </button>
        </p>
        <p>
          <button type="button" onClick={addMemberToGroup} className="w3-button w3-white w3-border w3-border-red w3-round-large">
            Click here to Add User to Group.
          </button>
        </p>
      </div>
    );
  };
  
  export default addMember;