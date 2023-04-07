import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from '../abi/SemaphoreCommunities.json';

const semaphoreCommunitiesAddress = "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";

async function fillForm() {
    let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    document.getElementById("editor").value = await signer.getAddress();
}

async function createGroup() {
      let groupName = document.getElementById("groupName").value;
      let editor = document.getElementById("editor").value;
      let merkleTreeDepth = document.getElementById("merkleTreeDepth").value;

      let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        semaphoreCommunitiesAddress,
        SemaphoreCommunitiesABI.abi,
        signer
      );
      const tx = await contract.createGroup(groupName, editor, merkleTreeDepth);
      console.log("Success!");
      console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);

    //   document.getElementById("groupName").value = "";
    //   document.getElementById("editor").value = "";
    //   document.getElementById("merkleTreeDepth").value = "";
      document.getElementById("createGroupForm").reset();

      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
 
    }


const CreateGroup = () => {

    return (
      <div>
        <h1>Create Group Page</h1>
        <br />
        <Link to="/">Identities</Link> |{" "} <Link to="/Groups">On-Chain Groups</Link> |{" "} <Link to="/OffchainGroups">Off-Chain Groups</Link> |{" "} <Link to="/Messages">Messages</Link> |{" "} <Link to="/SendFeedback">Send Feedback</Link> |{" "} <Link to="/AllGroups">All Groups</Link> |{" "} <Link to="/CreateGroup">Create Group</Link>
        <p>Create Group:</p>
        <form id="createGroupForm">
          <label htmlFor="groupName">Group Name:</label> &nbsp;
          <input type="text" id="groupName" name="groupName" size="30" />
          <p></p>
          <label htmlFor="editor">Group Editor:</label> &nbsp;
          <input type="text" id="editor" name="editor" size="48" /> <button type="button" onClick={fillForm}>
            Use My Address
          </button>
          <p></p>
          <label htmlFor="merkleTreeDepth">Merkle Tree Depth:</label> &nbsp;
          <select name="merkleTreeDepth" id="merkleTreeDepth">
            <option value="16">16</option>
            <option value="20">20</option>
            <option value="24">24</option>
            <option value="28">28</option>
            <option value="32">32</option>
          </select>
          <p></p>
        </form>
        <p>
          <button type="button" onClick={createGroup}>
            Click here to create a new Group.
          </button>
        </p>
      </div>
    );
  };
  
  export default CreateGroup;