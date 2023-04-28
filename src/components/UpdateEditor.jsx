/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import SemaphoreContractABI from "../abi/Semaphore.json";

const semaphoreContractAddress = process.env.REACT_APP_SEMAPHORE;

async function updateEditor() {
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

function editorComponent() {
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    async function fetchEditor() {
      const semaphoreSubgraph = new SemaphoreSubgraph();
      const queryParams = new URLSearchParams(window.location.search);
      const entityCurrentID = queryParams.get("entityID");
      // eslint-disable-next-line no-const-assign, @typescript-eslint/no-shadow
      const currentAdmin = await semaphoreSubgraph.getGroup(entityCurrentID, { admin: true });
      setCurrentAdmin(currentAdmin.admin);
    }
    fetchEditor();
  }, []);

  return (
    <div>
      <h1>Update Editor Page</h1>
      <br />
      <Link to="/AllGroups">All Groups</Link> |{" "}
      <h2 className="w3-center">
        Current Editor Address: {currentAdmin}{" "}
      </h2>
      <div
        id="updateEditorForm"
        className="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin"
      >
        <div className="w3-col" style={{ width: `${50}px` }}>
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
  )
  ;
}
export default editorComponent;