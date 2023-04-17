import React from "react";
import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";
import { ethers, utils } from "ethers"
import FeedbackContractABI from '../abi/Feedback.json';

// console.log("Identity: " + localStorage.getItem('myIdentity'));
// console.log("Commitment: " + localStorage.getItem('myCommitment'));

async function getProof() {
  const feedbackAddress = "0x0C339f45aB084F48C60F82Fecb1844C72a6CcaDa";
  const groupID = "444";
  let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const group = new Group(groupID);
  //const externalNullifier = utils.formatBytes32String("Topic");
  const signal = utils.formatBytes32String("Hello world");
  // let textareaValue = document.getElementById("messageTxt").value;
  // const feedbackBytes32 = formatBytes32String(textareaValue);
  const identity2 = new Identity();
  group.addMember(identity2.commitment);


  const userName = "0x636d73746f6e6500000000000000000000000000000000000000000000000000";

  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  //let userAddress = await signer.getAddress();
  let contract = new ethers.Contract(feedbackAddress, FeedbackContractABI.abi, signer);
  const tx = await contract.joinGroup(identity2.commitment, userName);
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);


  const externalNullifier = group.root;
  const fullProof = await generateProof(identity2, group, externalNullifier, signal);

  // await provider.send("eth_requestAccounts", []);
  // const signer = provider.getSigner();
  // let contract = new ethers.Contract(feedbackAddress, FeedbackContractABI.abi, signer);
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

  const gasPrice = await signer.getGasPrice();
  console.log("gasPrice: " + gasPrice);

  let nonce = await signer.getTransactionCount();

  // const gasEstimated = await contract.estimateGas.sendFeedback(signal, externalNullifier, idNullifier, proofString, { gasLimit: 1000000, nonce: nonce || undefined, });
  // console.log("gasEstimated: " + gasEstimated);

  const txGreet = await contract.sendFeedback(signal, externalNullifier, idNullifier, proofString, { gasLimit: 1000000, nonce: nonce || undefined, });
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${txGreet.hash}`);
  const receiptGreet = await txGreet.wait();
  console.log(`Transaction confirmed in block ${receiptGreet.blockNumber}`);
  console.log(`Gas used: ${receiptGreet.gasUsed.toString()}`);
 }
// getProof();

const Feedback = () => {

  return (
    <div>
      <h1>Send Feedback Page</h1>
      <br />
      <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link> | <Link to="/OffchainGroups">Off-Chain Groups</Link> | <Link to="/Messages">Messages</Link> | <Link to="/SendFeedback">Send Feedback</Link>
      <p>Anonymous Message:</p>
      <p><textarea id="messageTxt" name="messageTxt" rows="4" cols="50">
      </textarea></p>
      <p><button type="button" onClick={ getProof }>Click here to send the Signal</button></p>
    </div>
  );
};

export default Feedback;