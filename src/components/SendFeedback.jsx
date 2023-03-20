//import { group } from "console";
import React from "react";
import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";
import { SemaphoreEthers } from "@semaphore-protocol/data";
import { ethers, utils } from "ethers"
import { formatBytes32String } from "ethers/lib/utils"
import FeedbackContractABI from '../abi/Feedback.json';

const semaphoreEthers = new SemaphoreEthers();
const feedbackAddress = "0x0C339f45aB084F48C60F82Fecb1844C72a6CcaDa";
const userName = "0x636d73746f6e6500000000000000000000000000000000000000000000000000";
const groupID = "444";

let provider = new ethers.providers.Web3Provider(window.ethereum, "any");

//const identity = new Identity();
const { trapdoor, nullifier, commitment } = new Identity();
console.log("Identity: " + localStorage.getItem('myIdentity'));
console.log("Commitment: " + localStorage.getItem('myCommitment'));

async function getProof() {
  const group = new Group(groupID);
  const externalNullifier = utils.formatBytes32String("Topic");
  const signal = utils.formatBytes32String("Hello world");
  const identity = localStorage.getItem('myIdentity');
  const fullProof = await generateProof(identity, group, externalNullifier, signal);
  console.log("FullProof: " + fullProof);
}
getProof();



// async function joinGroup() {
//   await provider.send("eth_requestAccounts", []);
//   const signer = provider.getSigner();
//   //let userAddress = await signer.getAddress();
//   let contract = new ethers.Contract(feedbackAddress, FeedbackContractABI.abi, signer);
//   const tx = await contract.joinGroup(commitment, userName);
//   console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
//   const receipt = await tx.wait();
//   console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
//   console.log(`Gas used: ${receipt.gasUsed.toString()}`);
// }  
// joinGroup();

async function sendMsg() {
  let textareaValue = document.getElementById("messageTxt").value;
  // let greeting = ethers.utils.formatBytes32String(textareaValue);

  // let obj = '';
  // let merkleTreeRoot = '';
  // await semaphoreEthers.getGroup(groupID).then((result) => {
  //   obj = result.merkleTree;
  //   merkleTreeRoot = obj.root;
  // });
  //console.log("sendMsg Commitment: " + commitment);
  // const theProof = await generateProof(commitment, merkleTreeRoot, extNullifier, greeting);
  // const callDataProof = theProof.signal;
 // console.log("callDataProof: " + callDataProof);
//   uint256[8] calldata proof

////////////////////////////////
// const newIdentity = new Identity();
//const group = new Group(groupID);
const group = new Group("444");
// console.log("newIdentity: " + newIdentity);
// console.log("newIdentity.commitment: " + newIdentity.commitment);
//group.addMember(newIdentity.commitment);
const feedbackBytes32 = formatBytes32String(textareaValue);
// await semaphoreEthers
// .getGroupMembers(groupID)
// .then((allMembers) => {
//   //  this.setState({ allMembers });
//   group.addMember(newIdentity.commitment);
// });

const myCommit = localStorage.getItem('myCommitment');
console.log("myCommit: " + myCommit);
  const extNullifier = utils.formatBytes32String("Topic");
  //const fullProof = await generateProof(myCommit, group, extNullifier, feedbackBytes32);
  //const fullProof = await generateProof(myCommit, group, externalNullifier, signal);

  //console.log("fullProof: " + fullProof);
//  try {
//   const { proof, merkleTreeRoot, nullifierHash } = await generateProof(
//     commitment,
//     group,
//     extNullifier,
//     feedbackBytes32
//   );

//   console.log("proof: " + proof);
//   console.log("merkleTreeRoot: " + merkleTreeRoot);
//   console.log("nullifierHash: " + nullifierHash);
// } catch (error) {
//   console.error("Error: " + error);
// }






////////////////////////////////
  // await provider.send("eth_requestAccounts", []);
  // const signer = provider.getSigner();
  // let contract = new ethers.Contract(feedbackAddress, FeedbackContractABI.abi, signer);
  // const txGreet = await contract.greet(feedbackBytes32, merkleTreeRoot, nullifierHash, proof);
  // console.log(`Transaction hash: https://goerli.etherscan.io/tx/${txGreet.hash}`);
  // const receiptGreet = await txGreet.wait();
  // console.log(`Transaction confirmed in block ${receiptGreet.blockNumber}`);
  // console.log(`Gas used: ${receiptGreet.gasUsed.toString()}`);
}  


// **
// ********************************
// https://github.com/semaphore-protocol/semaphore/blob/main/packages/proof/README.md
// ********************************


async function test() {
  const identity = new Identity();
  console.log("Identity: " + identity);
  const myCommit = localStorage.getItem('myCommitment');
  const group = new Group("444");
  // for (let key in group) {
  //   console.log(key + ': ' + group[key]);
  // }
  group.addMember(myCommit);
  console.log("groupID: " + group.id);
  console.table("Group: " + group.addMember(identity.commitment));
  const externalNullifier = utils.formatBytes32String("Topic");
  console.log("External Nullifier: " + externalNullifier);
  const signal = utils.formatBytes32String("Hello world");
  console.log("Signal: " + signal);
  group.addMember([identity.generateCommitment]);
  console.log("Members: " + group.members);
  console.log("myCommit: " + myCommit);
  //const fullProof = await generateProof(identity.commitment, group, externalNullifier, signal);
  const fullProof = await generateProof(myCommit, group, externalNullifier, signal);
  console.log("FullProof: " + fullProof.signal);
}
//test();

const Feedback = () => {

  return (
    <div>
      <h1>Send Feedback Page</h1>
      <br />
      <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link> | <Link to="/OffchainGroups">Off-Chain Groups</Link> | <Link to="/Messages">Messages</Link> | <Link to="/SendFeedback">Send Feedback</Link>
      <p>Anonymous Message:</p>
      <p><textarea id="messageTxt" name="messageTxt" rows="4" cols="50">
      </textarea></p>
      <p><button type="button" onClick= { sendMsg }></button></p>
    </div>
  );
};

export default Feedback;