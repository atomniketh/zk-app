import React from "react";
import { sidebar } from "./Sidebar";
import { SemaphoreEthers } from "@semaphore-protocol/data";
import { Wallet } from "ethers";
import { Client } from "@xmtp/xmtp-js";

const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK);

const queryParams = new URLSearchParams(window.location.search);
const groupIDNum = queryParams.get("entityID");
const groupName = queryParams.get("entityName");

async function msgGroupAdmin() {

    const adminAddress = await semaphoreEthers.getGroupAdmin(groupIDNum);
    console.log("Admin Address: ", adminAddress);
    const msgtoAdmin = document.getElementById(
        "msgForAdmin"
      ).value;
    console.log("Message to Admin: ", msgtoAdmin);

    const wallet = Wallet.createRandom();
    const xmtp = await Client.create(wallet, { env: "production" });
    const conversation = await xmtp.conversations.newConversation(
        adminAddress
    );
    // Load all messages in the conversation
    // ************* This can be removed after testing *************
    // const messages = await conversation.messages();
    // *************************************************************

    await conversation.send(`A member of ${groupName} says: ${msgtoAdmin}`);
    document.getElementById("msgForAdmin").value = "";
}

const MessageGroupAdmin = () => (
  <div className="w3-container" style={{ marginLeft: "0", paddingLeft: "0" }}>
    {sidebar}
    <div className="w3-main" style={{ marginLeft: "250px" }}>
      <h1>Send a Message to { groupName } Group Administrator</h1>
      <div
          id="sendMsgForm1"
          className="w3-container w3-card-4 w3-light-grey w3-text-black w3-margin"
        >
      <form id="sendMsgForm1">
        <label htmlFor="msgForAdmin">Message:</label> &nbsp;
        <textarea
                className="w3-input w3-border"
                id="msgForAdmin"
                name="msgForAdmin"
                rows="4"
                cols="50"
              />
        <p></p>
      </form>
      <p>
        <button className="w3-button w3-black" type="button" onClick={msgGroupAdmin}>
          Send
        </button>
      </p>
      </div>
    </div>
    <br />
  </div>
);

export default MessageGroupAdmin;
