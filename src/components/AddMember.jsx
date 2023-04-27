/* eslint-disable no-console */
import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
// import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";
import SemaphoreContractABI from "../abi/Semaphore.json";

// const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;
const semaphoreContractAddress = process.env.REACT_APP_SEMAPHORE;

async function checkEditor() {
  // check if user is the group editor
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = queryParams.get("entityID");
  const _entityEditor = queryParams.get("entityEditor");
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let isEditor = false;
  if ((await signer.getAddress()) === _entityEditor) {
    isEditor = true;
    console.log(`You are the editor of the group: ${  _entityID}`);
  } else {
    isEditor = false;
    console.log(`You are not the editor of the group: ${  _entityID}`);
    alert(`You are not the editor of the group: ${  _entityID}`);
  }
  console.log(`Are you the editor of the group: ${  isEditor}`);
}

async function addMemberToGroup() {
  const _memberCommitment = document.getElementById("memberCommitment").value;
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = queryParams.get("entityID");
  console.log(`${_entityID  } ${  _memberCommitment}`);

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  console.log(`Contract address: ${  semaphoreContractAddress}`);
  const contract = new ethers.Contract(
    semaphoreContractAddress,
    SemaphoreContractABI.abi,
    signer
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nonce = await signer.getTransactionCount();
  console.log(`Adding membercommitment ${  _memberCommitment  } to ${  _entityID}`);
//  const tx = await contract.addWhistleblower(_entityID, _memberCommitment, { gasLimit: 1000000, nonce: nonce || undefined });
  const tx = await contract.addMember(_entityID, _memberCommitment);
  console.log("Success!");
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
  document.getElementById("memberCommitment").value = "";
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);
}

const addMember = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const groupName = queryParams.get("entityName");

  return (
    <div>
      <h1>Add Member to Group</h1>
      <br />
      <p>
        <Link to="/AllGroups">All Groups</Link>
      </p>
      <h2>Add Member to {groupName} Group: </h2>

      <div
        id="addMemberForm"
        className="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin"
      >
        {/* <input type="hidden" id="entityID" name="entityID" value={queryParams.get("entityID")} /> */}
        <p></p>
        <label htmlFor="memberCommitment">Commitment:</label> &nbsp;
        <div className="w3-col" style={{ width: `${50  }px` }}>
          <i className="w3-xxlarge fa fa-pencil"></i>
        </div>
        <input
          type="text"
          id="memberCommitment"
          name="memberCommitment"
          size="90"
        />
        <div className="w3-rest"></div>
        <p></p>
        <p>
          <button
            type="button"
            onClick={checkEditor}
            className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
          >
            Click here to Check if the editor is you.
          </button>
        </p>
        <p>
          <button
            type="button"
            onClick={addMemberToGroup}
            className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
          >
            Click here to Add User to Group.
          </button>
        </p>
      </div>
    </div>
  );
};

export default addMember;
