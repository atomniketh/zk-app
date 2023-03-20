import React from "react";
import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";
import { ethers, utils } from "ethers"
import FeedbackContractABI from '../abi/Feedback.json';

const feedbackAddress = "0x0C339f45aB084F48C60F82Fecb1844C72a6CcaDa";
const groupID = "444";
let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

// console.log("Identity: " + localStorage.getItem('myIdentity'));
// console.log("Commitment: " + localStorage.getItem('myCommitment'));

async function getProof() {
  const group = new Group(groupID);
  //const externalNullifier = utils.formatBytes32String("Topic");
  const signal = utils.formatBytes32String("Hello world");
  // let textareaValue = document.getElementById("messageTxt").value;
  // const feedbackBytes32 = formatBytes32String(textareaValue);
  const identity2 = new Identity();
  group.addMember(identity2.commitment);
  console.log("Identity: " + identity2);
  const externalNullifier = group.root;
  const fullProof = await generateProof(identity2, group, externalNullifier, signal);

  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(feedbackAddress, FeedbackContractABI.abi, signer);
  const idNullifier = identity2.nullifier;
  let proofString = fullProof.proof;
  console.log("Length: " + proofString.length);

  // const abiCoder = new utils.AbiCoder();
  // const encodedProof = abiCoder.encode(['uint256[8]'], [fullProof.proof]);
  // console.log("Encoded proof: " + encodedProof);

  console.log("signal: " + signal);
  console.log("externalNullifier: " + externalNullifier);
  console.log("idNullifier: " + idNullifier);
  console.log("proofString: " + proofString);

  const txGreet = await contract.greet(signal, externalNullifier, idNullifier, proofString);
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${txGreet.hash}`);
  const receiptGreet = await txGreet.wait();
  console.log(`Transaction confirmed in block ${receiptGreet.blockNumber}`);
  console.log(`Gas used: ${receiptGreet.gasUsed.toString()}`);
}
getProof();

const Feedback = () => {

  return (
    <div>
      <h1>Send Feedback Page</h1>
      <br />
      <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link> | <Link to="/OffchainGroups">Off-Chain Groups</Link> | <Link to="/Messages">Messages</Link> | <Link to="/SendFeedback">Send Feedback</Link>
      <p>Anonymous Message:</p>
      <p><textarea id="messageTxt" name="messageTxt" rows="4" cols="50">
      </textarea></p>
      <p><button type="button" onClick={generateProof}></button></p>
    </div>
  );
};

export default Feedback;