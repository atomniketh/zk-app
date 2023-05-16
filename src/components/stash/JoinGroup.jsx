import React from "react";
import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from '../abi/SemaphoreCommunities.json';

const semaphoreCommunitiesAddress = process.env.REACT_APP_CONTRACT;

async function addWhistleblower() {
    let groupName = document.getElementById("groupName").value;

    let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      semaphoreCommunitiesAddress,
      SemaphoreCommunitiesABI.abi,
      signer
    );
    // onlyEditor(entityId) can call this function
    const tx = await contract.addWhistleblower(entityId, identityCommitment);
    console.log("Success!");
    console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);

  //   document.getElementById("groupName").value = "";
    document.getElementById("createGroupForm").reset();

    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
}

const Identities = () => {
    const { trapdoor, nullifier, commitment } = new Identity();
    // const group1 = new Group(1);
    // //const commitment = identity.generateCommitment()
    // group1.addMember(commitment);
  //   console.log("Group1: " + group1.indexOf(commitment));
  
    return (

        <div>
        <h1>Join Group Page</h1>
        <br />
        <Link to="/">Identities</Link> |{" "} <Link to="/Groups">On-Chain Groups</Link> |{" "} <Link to="/OffchainGroups">Off-Chain Groups</Link> |{" "} <Link to="/Messages">Messages</Link> |{" "} <Link to="/SendFeedback">Send Feedback</Link> |{" "} <Link to="/AllGroups">All Groups</Link> |{" "} <Link to="/CreateGroup">Create Group</Link>
        <p>Create Group:</p>
        <form id="createGroupForm">
          <label htmlFor="groupName">Group Name:</label> &nbsp;
          <input type="text" id="groupName" name="groupName" size="30" />
          <p></p>
          <label htmlFor="editor">Group Editor:</label> &nbsp;
          <input type="text" id="editor" name="editor" size="48" /> <button type="button">
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
          <button type="button" onClick={ addWhistleblower }>
            Click here to create a new User.
          </button>
        </p>

        <Link to="/CreateGroup">Create Group</Link>
        <h1>Identity Information</h1>
        <table>
          <tbody>
            <tr>
              <td>Trapdoor:</td>
              <td>{trapdoor.toString()}</td>
            </tr>
            <tr>
              <td>Nullifier:</td>
              <td>{nullifier.toString()}</td>
            </tr>
            <tr>
              <td>Commitment:</td>
              <td>{commitment.toString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Identities;