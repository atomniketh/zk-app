/* eslint-disable no-console */
import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { sidebar } from "./Sidebar";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;

// import SemaphoreABI from '../abi/Semaphore.json';
// const semaphoreAddress = process.env.REACT_APP_CONTRACT;

async function fillForm() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  document.getElementById("editor").value = await signer.getAddress();
}

async function createGroup() {
  document.getElementById("box").style.display = "block";
  const groupName = document.getElementById("groupName").value;
  const editor = document.getElementById("editor").value;
  //  const merkleTreeDepth = document.getElementById("merkleTreeDepth").value;
  const merkleTreeDepth = process.env.REACT_APP_TREEDEPTH;
  // console.log("merkleTreeDepth is: " + merkleTreeDepth);

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    semaphoreCommunitiesAddress,
    SemaphoreCommunitiesABI.abi,
    signer
  );
  // let contract = new ethers.Contract(
  //   semaphoreAddress,
  //   SemaphoreABI.abi,
  //   signer
  // );
  // console.log(contract);
  const tx = await contract.createGroup(groupName, editor, merkleTreeDepth);
  // const tx = await contract.createGroup(groupName, merkleTreeDepth, editor, 3600);

  // console.log("Success!");
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);

  document.getElementById("createGroupForm").reset();

  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  // console.log(`Gas used: ${receipt.gasUsed.toString()}`);
  document.getElementById("box").style.display = "none";
  const newURL = "/AllGroups";
  document.location.href = newURL;
}

const CreateGroup = () => (
  useEffect(() => {
    document.getElementById("box").style.display = "none";
  // eslint-disable-next-line no-sequences
  }, []),
  (
    <div className="w3-container" style={{ marginLeft: "0", paddingLeft: "0" }}>
      {sidebar}
      <div className="w3-main" style={{ marginLeft: "250px" }}>
        <div id="box" className="loading">
          <span>
            Loading...
            <img src="https://i.gifer.com/ZZ5H.gif" alt="loading" />
          </span>
        </div>
        <h1>Create Group</h1>
        <div
          id="createGroupForm1"
          className="w3-container w3-card-4 w3-light-grey w3-text-black w3-margin"
        >
          <br />
          <form id="createGroupForm">
            <label htmlFor="groupName">Group Name:</label> &nbsp;
            <input type="text" id="groupName" name="groupName" size="30" />
            <p></p>
            <label htmlFor="editor">Group Editor:</label> &nbsp;
            <input type="text" id="editor" name="editor" size="48" />{" "}
            <button type="button" onClick={fillForm}>
              Use My Address
            </button>
            <p></p>
            {/* <label htmlFor="merkleTreeDepth">Merkle Tree Depth:</label> &nbsp;
        <select name="merkleTreeDepth" id="merkleTreeDepth">
          <option value="16">16</option>
          <option value="20">20</option>
          <option value="24">24</option>
          <option value="28">28</option>
          <option value="32">32</option>
        </select>
        <p></p> */}
          </form>
          <p>
            <button
              className="w3-button w3-black"
              type="button"
              onClick={createGroup}
            >
              Create Group
            </button>
          </p>
        </div>
      </div>
      <br />
    </div>
  )
);

export default CreateGroup;
