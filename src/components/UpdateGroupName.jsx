/* eslint-disable no-console */
import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;

async function updateGroupName() {
  const queryParams = new URLSearchParams(window.location.search);
  const _index = queryParams.get("index");
  const _entityID = queryParams.get("entityID");
  const newGroupName = document.getElementById("newGroupName").value;

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    semaphoreCommunitiesAddress,
    SemaphoreCommunitiesABI.abi,
    signer
  );

  // ****************************************************************
  // console.log(`info is: ${  _index}, ${  newGroupName}, ${  _entityID}`);
  // TODO: updateGroupName generates an error when the _index is "0"
  // ****************************************************************

  const tx = await contract.updateGroupName(_index, newGroupName, _entityID);
  //   console.log("Success!");
    console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
    document.getElementById("newGroupName").value = "";
    document.getElementById("groupName").innerHTML = newGroupName;
    document.getElementById("newGroupName").value = "";
    // const receipt = await tx.wait();
    // console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  //   console.log(`Gas used: ${receipt.gasUsed.toString()}`);
}

const UpdateGroupName = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const entityNameCurrent = queryParams.get("entityName");
  // console.log("Name is now: " + entityNameCurrent);
  return (
    <div>
      <h1>Update Group Name Page</h1>
      <p>
      <Link to="/AllGroups">All Groups</Link>
      </p>

      <h2 className="w3-center">Current Group Name: <div id="groupName" name="groupName">{entityNameCurrent}</div> </h2>
      <div id="updateGroupNameForm" className="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin">
        <div className="w3-col" style={{ width: `${50  }px` }}>
            <i className="w3-xxlarge fa fa-pencil"></i>
        </div>
        <div className="w3-rest">
          <p></p>
        <label htmlFor="newGroupName">New Group Name:</label> &nbsp;
        <input type="text" id="newGroupName" name="newGroupName" size="30" />
        </div>

      <p>
        <button type="button" onClick={updateGroupName} className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding">
          Click here to update Group Name.
        </button>
      </p>
      </div>
    </div>
  );
};

export default UpdateGroupName;