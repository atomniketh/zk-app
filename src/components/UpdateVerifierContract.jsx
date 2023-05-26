import React from "react";
// import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { sidebar } from "./Sidebar";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;

async function updateVerifierContract() {
  const newVerifierContract = document.getElementById(
    "newVerifierContract"
  ).value;

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    semaphoreCommunitiesAddress,
    SemaphoreCommunitiesABI.abi,
    signer
  );
  const tx = await contract.updateVerifierContract(newVerifierContract);
  console.log("Success!");
  console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
  document.getElementById("updateVerifierAddressForm").reset();
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);
}

const UpdateVerifierContract = () => (
  <div className="w3-container" style={{ marginLeft: "0", paddingLeft: "0" }}>
    {sidebar}

    <div className="w3-main" style={{ marginLeft: "250px" }}>
      <h1>Update Semaphore Contract</h1>
      <br />
      {/* <Link to="/AllGroups">All Groups</Link>
      <p></p> */}
      <form id="updateVerifierAddressForm">
        <label htmlFor="newVerifierContract">
          New Semaphore Contract Address:
        </label>{" "}
        &nbsp;
        <input
          type="text"
          id="newVerifierContract"
          name="newVerifierContract"
          size="48"
        />
        <p></p>
      </form>
      <p>
        <button type="button" onClick={updateVerifierContract} className="w3-button w3-block w3-section w3-black w3-ripple w3-padding" >
          Click here to u``pdate Semaphore Contract.
        </button>
      </p>
    </div>
  </div>
);

export default UpdateVerifierContract;
