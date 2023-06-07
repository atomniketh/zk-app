/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { sidebar } from "./Sidebar";
import SemaphoreContractABI from "../abi/Semaphore.json";

const semaphoreContractAddress = process.env.REACT_APP_SEMAPHORE;

async function UpdateEditor() {
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = queryParams.get("entityID");
  const _newEditor = document.getElementById("newEditorAddress").value;
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    semaphoreContractAddress,
    SemaphoreContractABI.abi,
    signer
  );
  const tx = await contract.updateGroupAdmin(_entityID, _newEditor);
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
  document.getElementById("newEditorAddress").value = "";
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);
}

function EditorComponent() {
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    async function fetchEditor() {
      const semaphoreSubgraph = new SemaphoreSubgraph(process.env.REACT_APP_NETWORK);
      const queryParams = new URLSearchParams(window.location.search);
      const entityCurrentID = queryParams.get("entityID");
      // eslint-disable-next-line no-const-assign, @typescript-eslint/no-shadow
      const currentAdmin = await semaphoreSubgraph.getGroup(entityCurrentID, {
        admin: true,
      });
      console.log(`Current admin: ${currentAdmin.admin}`);
      setCurrentAdmin(currentAdmin.admin);
    }
    fetchEditor();
  }, []);

  return (
    <div className="w3-container" style={{ marginLeft: "0", paddingLeft: "0" }}>
      {sidebar}

      <div className="w3-main" style={{ marginLeft: "250px" }}>
        <h1>Update Editor</h1>
        <br />
        <div
          id="updateEditorForm"
          className="w3-container w3-card-4 w3-light-grey w3-text-black w3-margin"
        >
        <h2 className="w3-center">Current Editor Address: {currentAdmin} </h2>

          {/* <div className="w3-col" style={{ width: `${50}px` }}>
            <i className="w3-xxlarge fa fa-pencil"></i>
          </div> */}
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
          <br></br>
        </div>
        <p>
          <button
            type="button"
            onClick={UpdateEditor}
            className="w3-button w3-block w3-section w3-black w3-ripple w3-padding"
          >
            Click here to update Editor Address.
          </button>
        </p>
      </div>
    </div>
  );
}
export default EditorComponent;
