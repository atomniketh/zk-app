import React from "react";
import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity";
// import { Group } from "@semaphore-protocol/group";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from '../abi/SemaphoreCommunities.json';

const semaphoreCommunitiesAddress = "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";

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
    const tx = await contract.addWhistleblower(entityId, identityCommitment);
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



const Identities = () => {
    const { trapdoor, nullifier, commitment } = new Identity();
    // const group1 = new Group(1);
    // //const commitment = identity.generateCommitment()
    // group1.addMember(commitment);
  //   console.log("Group1: " + group1.indexOf(commitment));
  
    return (
      <div>
        <h1>Join Group Page</h1>
        <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link> | <Link to="/OffchainGroups">Off-Chain Groups</Link> | <Link to="/Messages">Messages</Link> | <Link to="/SendFeedback">Send Feedback</Link> | <Link to="/AllGroups">All Groups</Link> | <Link to="/Groups">On-Chain Groups</Link> | <Link to="/OffchainGroups">Off-Chain Groups</Link> | <Link to="/Messages">Messages</Link> | <Link to="/SendFeedback">Send Feedback</Link>
<p>If you are a whistleblower, please click the button below to add your identity to the whistleblower list.</p>

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