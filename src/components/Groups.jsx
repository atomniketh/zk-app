import React from "react";
import { Link } from "react-router-dom";
import { ethers } from 'ethers';
import FeedbackContractABI from '../abi/Feedback.json';
import { Identity } from "@semaphore-protocol/identity";

//const { identity, trapdoor, nullifier, commitment } = new Identity();
const identity = new Identity()
const feedbackAddress = "0x7832A5B527ce8c7d6282e7FbA53F3A9A598D67Ed"
// block number when the smart contract was deployed
// const startBlock = 8593998;
const userName = "0x636d73746f6e6500000000000000000000000000000000000000000000000000";
//

  // request access to the user's MetaMask account
  // async function requestAccount() {
  //   await window.ethereum.request({ method: 'eth_requestAccounts' });
  // }

  let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  async function joinGroup() {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    //let userAddress = await signer.getAddress();
    let contract = new ethers.Contract(feedbackAddress, FeedbackContractABI.abi, signer);
    const tx = await contract.joinGroup(identity.commitment, userName);
    console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);

    localStorage.setItem('myIdentity', identity.toString);
    console.log("myIdentity: " + localStorage.getItem('myIdentity'));
    localStorage.setItem('myCommitment', identity.commitment);
    console.log("myCommitment: " + localStorage.getItem('myCommitment'));
  }  
  // joinGroup();

const Groups = () => {

    return (
      <div>
        <h1>Groups Page</h1>
        <br />
        <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link> | <Link to="/OffchainGroups">Off-Chain Groups</Link> | <Link to="/Messages">Messages</Link> | <Link to="/SendFeedback">Send Feedback</Link>
        <p><button type="button" onClick= { joinGroup }></button></p>

      </div>
    );
  };
  
  export default Groups;