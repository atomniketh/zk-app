import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { Identity } from "@semaphore-protocol/identity";
import 'font-awesome/css/font-awesome.min.css';
import SemaphoreCommunitiesABI from '../abi/SemaphoreCommunities.json';

const semaphoreCommunitiesAddress = "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";

async function getIdentityInfo() {

    const queryParams = new URLSearchParams(window.location.search);
    const groupName = queryParams.get("entityName");
    const _entityID = queryParams.get("entityID");
    const groupToJoin = "identity" + _entityID;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
      const signMessage = async () => {
        const messageToSign =
          "I am requesting to join Group ID " +
          _entityID +
          " named " +
          groupName +
          ".";
        const [signedMessage, setSignedMessage] = React.useState("");
        const signedData = await signer.signMessage(messageToSign);
        setSignedMessage(signedData);

        const { trapdoor, nullifier, commitment } = new Identity(signedMessage);
        console.log(
            "Identity now in local storage is: " + localStorage.getItem(groupToJoin)
          );
        console.log("identity2 commitment: " + commitment);
        console.log("identity2 nullifier: " + nullifier);
        console.log("identity2 trapdoor: " + trapdoor);
        }
}


async function sendMessageToGroup() {
        const _leakMessage = document.getElementById("leakMessage").value;
        const queryParams = new URLSearchParams(window.location.search);
        const _entityID = queryParams.get("entityID");
        // console.log(_entityID + " " + _memberCommitment);
        const _nullifierHash = "blank";
        const _proof = "blank";

      let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        semaphoreCommunitiesAddress,
        SemaphoreCommunitiesABI.abi,
        signer
      );

    //   function publishLeak(
    //     uint256 leak,
    //     uint256 nullifierHash,
    //     uint256 entityId,
    //     uint256[8] calldata proof

      const tx = await contract.publishLeak(_leakMessage, _nullifierHash, _entityID, _proof);
      console.log("Success!");
      console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
      document.getElementById("addMemberForm").reset();
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    }

 const sendMessage = () => {

    const queryParams = new URLSearchParams(window.location.search);
    const groupName = queryParams.get("entityName");

    return (
      <div>
        <h1>Send Message</h1>
        <p><Link to="/AllGroups">All Groups</Link> |{" "} <Link to="/CreateGroup">Create Group</Link></p>

        {/* <p>Send Message to {groupName} Group: </p> */}

        <form id="addMemberForm" className="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin" >
            <h2 className="w3-center">Send Message to '{groupName}' Group: </h2>

            <div className="w3-row w3-section">
            <div className="w3-col" style={{width: 50 + 'px'}} >
                {/* <i className="fa" className="w3-col"></i> */}
                <i className="w3-xxlarge fa fa-envelope-o"></i>
            </div>
                <div className="w3-rest">
                    <textarea className="w3-input w3-border" id="leakMessage" name="leakMessage" rows="4" cols="50" />
            </div> </div>

            <button onClick={sendMessageToGroup} className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding">Send</button>

        </form>
      </div>
    );
  };
  
  export default sendMessage;