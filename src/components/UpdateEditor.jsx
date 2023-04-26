import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;

async function updateEditor() {
  const queryParams = new URLSearchParams(window.location.search);
  const _index = queryParams.get("index");
  const _entityID = queryParams.get("entityID");
  const _newEditor = document.getElementById("newEditorAddress").value;

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    semaphoreCommunitiesAddress,
    SemaphoreCommunitiesABI.abi,
    signer
  );
  const tx = await contract.updateGroupEditor(_index, _newEditor, _entityID);
  // console.log("Success!");
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
  document.getElementById("updateEditorForm").reset();
  // const receipt = await tx.wait();
  // console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  // console.log(`Gas used: ${receipt.gasUsed.toString()}`);
}

const UpdateEditor = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const entityCurrentEditor = queryParams.get("entityEditor");
  // console.log("Name is now: " + entityNameCurrent);
  return (
    <div>
      <h1>Update Editor Page</h1>
      <br />
      <Link to="/AllGroups">All Groups</Link> |{" "}
      <h2 className="w3-center">
        Current Editor Address: {entityCurrentEditor}{" "}
      </h2>
      <div
        id="updateEditorForm"
        className="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin"
      >
        <div className="w3-col" style={{ width: `${50  }px` }}>
          <i className="w3-xxlarge fa fa-pencil"></i>
        </div>
        <div className="w3-rest">
          <p></p>
          <label htmlFor="newEditorAddress">New Editor Address:</label> &nbsp;
          <input
            type="text"
            id="newEditorAddress"
            name="newEditorAddress"
            size="50"
          />
        </div>
      </div>
      <p>
        <button
          type="button"
          onClick={updateEditor}
          className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding">
          Click here to update Editor Address.
        </button>
      </p>
    </div>
  );
};

export default UpdateEditor;
