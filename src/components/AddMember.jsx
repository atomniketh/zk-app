/* eslint-disable no-console */
import React from "react";
// import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { sidebar } from './Sidebar';
import SemaphoreContractABI from "../abi/Semaphore.json";
import { SemaphoreEthers } from "@semaphore-protocol/data";

const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK);
const semaphoreContractAddress = process.env.REACT_APP_SEMAPHORE;

// async function checkEditor() {
//   // check if user is the group editor
//   const queryParams = new URLSearchParams(window.location.search);
//   const _entityID = queryParams.get("entityID");
//   const _entityEditor = queryParams.get("entityEditor");

//   const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
//   await provider.send("eth_requestAccounts", []);
//   const signer = provider.getSigner();
//   let isEditor = false;
//   if ((await signer.getAddress()) === _entityEditor) {
//     isEditor = true;
//     console.log(`You are the editor of the group: ${_entityID}`);
//   } else {
//     isEditor = false;
//     console.log(`You are not the editor of the group: ${_entityID}`);
//     alert(`You are not the editor of the group: ${_entityID}`);
//   }
//   console.log(`Are you the editor of the group: ${isEditor}`);
// }

async function addMemberToGroup() {
  const _memberCommitment = document.getElementById("memberCommitment").value;
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = queryParams.get("entityID");
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    semaphoreContractAddress,
    SemaphoreContractABI.abi,
    signer
  );

  const allMembers = await semaphoreEthers.getGroupMembers(_entityID)
  //console.log("Members: ", allMembers, " in ", _entityID);
  let memberExists = false;
  for (let key in allMembers) {
    //console.log(key + ": " + allMembers[key]);
    if (allMembers[key] === _memberCommitment) {
      memberExists = true;
    }
  }

  if (memberExists) {
    console.log("No need to add. This member already exists.")
  } else {
    console.log(`Adding membercommitment ${_memberCommitment} to ${_entityID}`);
    const tx = await contract.addMember(_entityID, _memberCommitment);
    console.log("Success!");
    console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
    document.getElementById("memberCommitment").value = "";
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
  }
}

const addMember = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const groupName = queryParams.get("entityName");
  return (
        <div className="w3-container"
                    style={{ marginLeft: "0", paddingLeft: "0" }}
                    >
          { sidebar }            

          <div className="w3-main" style={{ marginLeft: "250px" }}>
      <h1>Add Member to {groupName} Group</h1>
      <br />

      <div
        id="addMemberForm"
        className="w3-container w3-card-4 w3-light-grey w3-text-black w3-margin"
      >
      <h2>Add Member: </h2>
        {/* <input type="hidden" id="entityID" name="entityID" value={queryParams.get("entityID")} /> */}
        <p></p>
        <label htmlFor="memberCommitment">Commitment:</label> &nbsp;
        {/* <div className="w3-col" style={{ width: `${50}px` }}>
          <i className="w3-xxlarge fa fa-pencil"></i>
        </div> */}
        <input
          type="text"
          id="memberCommitment"
          name="memberCommitment"
          size="90"
        />
        <div className="w3-rest"></div>
        <p></p>
        {/* <p>
          <button
            type="button"
            onClick={checkEditor}
            className="w3-button w3-block w3-section w3-black w3-ripple w3-padding"
          >
            Click here to Check if the editor is you.
          </button>
        </p> */}
        <p>
          <button
            type="button"
            onClick={addMemberToGroup}
            className="w3-button w3-block w3-section w3-black w3-ripple w3-padding"
          >
            Click here to Add User to Group.
          </button>
        </p>
      </div>
    </div>
    </div>
  );
};

export default addMember;