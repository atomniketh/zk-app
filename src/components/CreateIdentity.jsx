import React from "react";
// import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity";
import { ethers, Wallet } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import { sidebar } from './Sidebar';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Remove after testing ++++++++++++++++++++++++++++++++++++++++++++++++
const clearCookie = async () => {
  localStorage.clear();
  console.log("Cookies cleared");
  window.location.reload();
};
// Remove after testing ++++++++++++++++++++++++++++++++++++++++++++++++

function CreateIdentity() {
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = queryParams.get("entityID");
  const _entityName = queryParams.get("entityName");
  const _entityCurrentEditor = queryParams.get("entityEditor");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signedMessage, setSignedMessage] = React.useState("");
  // const [setSignedMessage] = React.useState("");
  
  const groupToJoin = `group${_entityID}`;

  if (localStorage.getItem(groupToJoin) === null) {
    console.log(`Identity is null`);
  } else {
    console.log(
      `Identity is stored as: ${localStorage.getItem(groupToJoin)}`
    );
  }

  const groupToJoinValue = localStorage.getItem(groupToJoin);
  const signMessage = async () => {
    const messageToSign = "zkCommunities Group " + _entityID;
    const signedData = await signer.signMessage(messageToSign);
    setSignedMessage(signedData);
    // console.log(`Signed Data: ${signedData}`);
    localStorage.setItem("signedData", signedData);
    // console.log(`signedMessage is now: ${signedMessage}`);
    const { commitment } = new Identity(signedData);
    const identityInfo = commitment;
    localStorage.setItem(groupToJoin, identityInfo.toString());
    console.log(
      `Identity now in local storage is: ${localStorage.getItem(groupToJoin)}`
    );

    const wallet = Wallet.createRandom();
    const xmtp = await Client.create(wallet, { env: "production" });
    const conversation = await xmtp.conversations.newConversation(
      _entityCurrentEditor
    );
    // Load all messages in the conversation
    // ************* This can be removed after testing *************
    // const messages = await conversation.messages();
    // *************************************************************

    await conversation.send(`${identityInfo} wants to join ${_entityID}`);

    // ************* This can be removed after testing *************
    // Listen for new messages in the conversation
    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.content}`);
    }
    // *************************************************************
  };

  return (
    <div className="w3-container"
    style={{ marginLeft: "0", paddingLeft: "0" }}
    >
{ sidebar }            

<div className="w3-main" style={{ marginLeft: "250px" }}>

      <div
        id="sendMessageForm"
        className="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin"
      >
        <h2 className="w3-center">
          Create an Identity to Join '{_entityName}' Group:{" "}
        </h2>
        {groupToJoinValue === null ? (
          <div className="w3-center w3-row w3-section">
            <div className="w3-rest">
              <i className="w3-xxlarge fa fa-pencil"></i>&nbsp;&nbsp;
              <button
                className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
                onClick={signMessage}
              >
                Sign Message
              </button>
              {/* &nbsp;&nbsp;<i className="w3-center w3-xxlarge fa fa-pencil"></i> */}
            </div>
          </div>
        ) : (
          <div className="w3-center">
            <button className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding">
              Request Access
            </button>
          </div>
        )}
        <p></p>
      </div>
      <p></p>
      <div className="w3-center">
        <button
          className="w3-button w3-block w3-section w3-blue w3-ripple w3-padding"
          onClick={clearCookie}
        >
          Clear ID in Storage
        </button>
      </div>
    </div>
    </div>
  );
}

export default CreateIdentity;