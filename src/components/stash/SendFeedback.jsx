import React from "react";
import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";
import { ethers, utils } from "ethers"
// import FeedbackContractABI from '../abi/Feedback.json';
import SemaphoreContractABI from "../abi/Semaphore.json";
// import { SemaphoreEthers } from "@semaphore-protocol/data";

// const semaphoreEthers = new SemaphoreEthers("goerli");
const semaphoreContractAddress = process.env.REACT_APP_SEMAPHORE;

// console.log("Identity: " + localStorage.getItem('myIdentity'));
// console.log("Commitment: " + localStorage.getItem('myCommitment'));

async function getProof() {
  // const feedbackAddress = "0x7832A5B527ce8c7d6282e7FbA53F3A9A598D67Ed";
  const groupID = "32474";
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const group = new Group(parseInt(groupID, 10));
  // const externalNullifier = utils.formatBytes32String("Topic");
  // const signal = utils.formatBytes32String("Hello world");
  const signal = ethers.BigNumber.from(utils.formatBytes32String("Hello world")).toString();
//  const signal = BigNumber.from(utils.formatBytes32String("Hello world")).toString();
  console.log(`signal: ${  signal}`);
  // let textareaValue = document.getElementById("messageTxt").value;
  // const feedbackBytes32 = formatBytes32String(textareaValue);
  const identity2 = new Identity("testing");
  if (group.indexOf(identity2.commitment) === -1) {
    group.addMember(identity2.commitment);    
  } else {
    console.log("Identity already exists in group");
  }
  const idIndex = group.indexOf(identity2.commitment);
  console.log(`identity2.commitment: ${  identity2.commitment}`);
  console.log(`idIndex: ${  idIndex}`);
  const groupProof = group.generateMerkleProof(idIndex);
  // console.log("GroupID: " + group.id);
  // console.log("Group Root: " + group.root);
  // console.log("Group Depth: " + group.depth);
  // console.log("Group zeroValue: " + group.zeroValue);
  // console.log("Group Leaves: " + group.numberOfLeaves);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const userName = "0x636d73746f6e6500000000000000000000000000000000000000000000000000";

  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  // let userAddress = await signer.getAddress();
  const contract = new ethers.Contract(semaphoreContractAddress, SemaphoreContractABI.abi, signer);
  // const tx = await contract.joinGroup(identity2.commitment);
  // console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
  // const receipt = await tx.wait();
  // console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  // console.log(`Gas used: ${receipt.gasUsed.toString()}`);

  const externalNullifier = group.root;
  const fullProof = await generateProof(identity2, groupProof, externalNullifier, signal);

  // await provider.send("eth_requestAccounts", []);
  // const signer = provider.getSigner();
  // let contract = new ethers.Contract(feedbackAddress, FeedbackContractABI.abi, signer);
  const idNullifier = identity2.nullifier;
  const proofString = fullProof.proof;
  console.log(`Length: ${  proofString.length}`);

  // const abiCoder = new utils.AbiCoder();
  // const encodedProof = abiCoder.encode(['uint256[8]'], [fullProof.proof]);
  // console.log("Encoded proof: " + encodedProof);

  console.log(`signal: ${  signal}`);
  console.log(`externalNullifier: ${  externalNullifier}`);
  console.log(`idNullifier: ${  idNullifier}`);
  console.log(`proofString: ${  proofString}`);

  const gasPrice = await signer.getGasPrice();
  console.log(`gasPrice: ${  gasPrice}`);

  const nonce = await signer.getTransactionCount();

  // const gasEstimated = await contract.estimateGas.sendFeedback(signal, externalNullifier, idNullifier, proofString, { gasLimit: 1000000, nonce: nonce || undefined, });
  // console.log("gasEstimated: " + gasEstimated);

  const txGreet = await contract.sendFeedback(signal, externalNullifier, idNullifier, fullProof.proof, { gasLimit: 1000000, nonce: nonce || undefined, });
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${txGreet.hash}`);
  const receiptGreet = await txGreet.wait();
  console.log(`Transaction confirmed in block ${receiptGreet.blockNumber}`);
  console.log(`Gas used: ${receiptGreet.gasUsed.toString()}`);
 }
// getProof();

const Feedback = () => (
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

export default Feedback;