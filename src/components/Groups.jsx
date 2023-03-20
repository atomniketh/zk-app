import React from "react";
import { Link } from "react-router-dom";
import { ethers } from 'ethers';
import FeedbackContractABI from '../abi/Feedback.json';
import { Identity } from "@semaphore-protocol/identity";

const { trapdoor, nullifier, commitment } = new Identity();
const feedbackAddress = "0x0C339f45aB084F48C60F82Fecb1844C72a6CcaDa"
// block number when the smart contract was deployed
const startBlock = 8593998;
const userName = "0x636d73746f6e6500000000000000000000000000000000000000000000000000";


  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  async function joinGroup() {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    //let userAddress = await signer.getAddress();
    let contract = new ethers.Contract(feedbackAddress, FeedbackContractABI.abi, signer);
    const tx = await contract.joinGroup(commitment, userName);
    console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    //localStorage.setItem(commitment);
    localStorage.setItem('myCommitment', commitment);
    console.log("myCommitment: " + localStorage.getItem('myCommitment'));
  }  
  // joinGroup();

const Groups = () => {

    return (
      <div>
        <h1>Groups Page</h1>
        <br />
        <ul>
        <li>
          {/* Endpoint to route to Identities component */}
          <Link to="/">Identities</Link>
        </li>
        <li>
          {/* Endpoint to route to Groups component */}
          <Link to="/Groups">On-Chain Groups</Link>
        </li>
        <li>
          {/* Endpoint to route to Groups component */}
          <Link to="/OffchainGroups">Off-Chain Groups</Link>
        </li>
        <li>
          {/* Endpoint to route to Feedback component */}
          <Link to="/SendFeedback">Send Feedback</Link>
        </li>
      </ul>

      </div>
    );
  };
  
  export default Groups;