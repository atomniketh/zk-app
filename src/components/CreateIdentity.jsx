import React from "react";
import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity";
import { ethers, Wallet } from "ethers";
import { Client } from "@xmtp/xmtp-js";

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
  const entityCurrentEditor = queryParams.get("entityEditor");

  const [signedMessage, setSignedMessage] = React.useState("");
  const groupToJoin = "identity" + _entityID;

  console.log(
    "Identity is already stored as: " + localStorage.getItem(groupToJoin)
  );
  const groupToJoinValue = localStorage.getItem(groupToJoin);
  const signMessage = async () => {
    const messageToSign =
      "I am requesting to join Group ID " +
      _entityID +
      " named " +
      _entityName +
      ".";
    const signedData = await signer.signMessage(messageToSign);
    setSignedMessage(signedData);
    const { commitment } = new Identity(signedMessage);
    const identityInfo = commitment;
    localStorage.setItem(groupToJoin, identityInfo.toString());
    console.log(
      "Identity now in local storage is: " + localStorage.getItem(groupToJoin)
    );

    const wallet = Wallet.createRandom();
    //const xmtp = await Client.create(wallet);
    const xmtp = await Client.create(wallet, { env: "production" });
    const conversation = await xmtp.conversations.newConversation(entityCurrentEditor);
    // Load all messages in the conversation
    const messages = await conversation.messages();
    await conversation.send(identityInfo + " wants to join " + _entityID);
    // Listen for new messages in the conversation
    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.content}`);
    };
  };

  return (
    <div>
      <Link to="/AllGroups">All Groups</Link> |
      <p>Create an Identity to Join this Group</p>
      {/* {groupToJoinValue === null && <button onClick={signMessage}>Sign Message</button>} */}
      {groupToJoinValue === null ? (
        <div>
          <button onClick={signMessage}>Sign Message</button>
          <p> Signed Message: {signedMessage}</p>
        </div>
      ) : (
        <button>Request Access</button>
      )}
      <button onClick={clearCookie}>Clear ID in Storage</button>
    </div>
  );
}

export default CreateIdentity;
