import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress =
  "0x233bd7b6de74e3029ffe1dac7fd2fcb2fdf9386c";

async function updateVerifierContract() {
  const newVerifierContract = document.getElementById(
    "newVerifierContract"
  ).value;

  let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(
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

const UpdateVerifierContract = () => {

  return (
    <div>
      <h1>Update Verifier Contract Page</h1>
      <br />
      <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link>{" "}
      | <Link to="/OffchainGroups">Off-Chain Groups</Link> |{" "}
      <Link to="/Messages">Messages</Link> |{" "}
      <Link to="/SendFeedback">Send Feedback</Link> |{" "}
      <Link to="/AllGroups">All Groups</Link> |{" "}
      <Link to="/CreateGroup">Create Group</Link>
    <p></p>
      <form id="updateVerifierAddressForm">
        <label htmlFor="newVerifierContract">
          New Verifier Contract Address:
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
        <button type="button" onClick={updateVerifierContract}>
          Click here to update Verifier Contract.
        </button>
      </p>
    </div>
  );
};

export default UpdateVerifierContract;
