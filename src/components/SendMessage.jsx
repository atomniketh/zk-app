import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from '../abi/SemaphoreCommunities.json';

const semaphoreCommunitiesAddress = "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";

async function sendMessageToGroup() {
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

    //   function publishLeak(
    //     uint256 leak,
    //     uint256 nullifierHash,
    //     uint256 entityId,
    //     uint256[8] calldata proof

      const tx = await contract.addWhistleblower(_entityID, _memberCommitment);
      console.log("Success!");
      console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
      document.getElementById("addMemberForm").reset();
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    }

//    function sendMessage() {
 const sendMessage = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const groupName = queryParams.get("entityName");

    return (
      <div>
        <h1>Send Message to Group</h1>
        <br />
        <Link to="/">Identities</Link> |{" "} <Link to="/Groups">On-Chain Groups</Link> |{" "} <Link to="/OffchainGroups">Off-Chain Groups</Link> |{" "} <Link to="/Messages">Messages</Link> |{" "} <Link to="/SendFeedback">Send Feedback</Link> |{" "} 
        <p><Link to="/AllGroups">All Groups</Link> |{" "} <Link to="/CreateGroup">Create Group</Link></p>
        <p>Send Message to {groupName} Group: </p>

        <form id="addMemberForm">
            {/* <input type="hidden" id="entityID" name="entityID" value={queryParams.get("entityID")} /> */}
            <label htmlFor="leakMessage">Message:</label> &nbsp;
            <textarea id="leakMessage" name="leakMessage" rows="4" cols="50" />
          <p></p>
        </form>

        <p>
          <button type="button" onClick={sendMessageToGroup}>
            Click here to Send Message to Group.
          </button>
        </p>
      </div>
    );
  };
  
  export default sendMessage;