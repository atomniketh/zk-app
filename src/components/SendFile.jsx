import React from "react";
// import { Link } from "react-router-dom";
import { utils, BigNumber } from "ethers";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof, verifyProof } from "@semaphore-protocol/proof";
import { SemaphoreEthers } from "@semaphore-protocol/data";
import { sidebar } from "./Sidebar";
import "font-awesome/css/font-awesome.min.css";
import SemaphoreContractABI from "../abi/Semaphore.json";
import { CID, create } from "ipfs-http-client";
import multihash from "multihashes";
// import { DefenderRelaySigner, DefenderRelayProvider } from 'defender-relay-client/lib/ethers';

const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK);
const semaphoreContractAddress = process.env.REACT_APP_SEMAPHORE;
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();

const submitFile = async (event) => {
  document.getElementById("box").style.display = "block";
  document.getElementById("thisButton").disabled = true;
  event.preventDefault();
  var input = document.getElementById("leakFile");
  // console.log("File Name: " + input.files.length);
  const queryParams = new URLSearchParams(window.location.search);
  const _entityID = parseInt(queryParams.get("entityID"), 10);
  const _entityIDStr = queryParams.get("entityID");
  const groupName = queryParams.get("entityName");
  // const groupToJoin = `group${_entityIDStr}`;
  // **************************************************************
  // **************** IPFS Section ***************
  // **************************************************************

  const projectId = process.env.REACT_APP_IPFS_PROJECTID;
  const projectSecret = process.env.REACT_APP_IPFS_PROJECTSECRET;
  const auth =
    "Basic " + window.btoa(projectId + ":" + projectSecret).toString("base64");
  const client = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });
  // const version = await client.version();
  // console.log("IPFS Node Version:", version.version);
  // console.log("Input Name: " + input.files.item(0).name);

  const fileDetails = {
    path: input.files.item(0).name,
    content: input.files.item(0),
    type: "application/file",
  };

  const options = {
    wrapWithDirectory: false,
    // progress: (prog) => console.log(`received: ${prog}`),
  };
  const fileAdd = await client.add(fileDetails, options);
  const theCID = fileAdd.cid.toString();
  //    await client.pin.add(file.cid).then((res) => {});

  // **************************************************************
  // **************** End of IPFS Section ***************
  // **************************************************************

  // **************************************************************
  // **************** Convert CID to Big Number ***************
  // console.log("Origin CID: ", CID.parse(theCID).toString());
  const tmpArray = multihash.fromB58String(CID.parse(theCID).toString());
  const b58decoded = multihash.decode(tmpArray).digest;
  const tmpHexStr = utils.hexlify(b58decoded);
  const tmpSignal = BigNumber.from(tmpHexStr, 16).toString();
  // console.log("Signal to use: ", tmpSignal);
  // **************************************************************

  // eslint-disable-next-line no-undef
  const group = new Group(parseInt(_entityID, 10), 20);
  // console.log("Formatted Signal: " + tmpSignal);
  const identity = new Identity(localStorage.getItem("signedData" + _entityID));

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 12; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  const externalNullifier = utils.formatBytes32String(randomString);
  const allMembers = await semaphoreEthers.getGroupMembers(_entityIDStr);
  group.addMembers(allMembers);
  const idIndex = group.indexOf(identity.commitment);
  const thisIdsGroupMerkleProof = group.generateMerkleProof(idIndex);

  const fullProof = await generateProof(
    identity,
    group,
    externalNullifier,
    tmpSignal
  );

  const vProof = await verifyProof(fullProof, 20);
  // console.log(`Verified Proof: ${vProof}`);

  if (vProof) {
    // ********** via Relayer **********
    var response = "";
    const strBigIntRoot = thisIdsGroupMerkleProof.root.toString();
    // console.log("strBigIntRoot: ", typeof strBigIntRoot);
    // eslint-disable-next-line no-unused-expressions
    response = await fetch(process.env.REACT_APP_OZ_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        abi: SemaphoreContractABI.abi,
        address: semaphoreContractAddress,
        functionName: "verifyProof",
        functionParameters: [
          _entityID,
          strBigIntRoot,
          tmpSignal,
          fullProof.nullifierHash,
          externalNullifier,
          fullProof.proof,
        ],
      }),
    });
    // console.log(`Response Status: ${response.status}`);
    if (response.status === 200) {
      document.getElementById("box").style.display = "none";
      const newURL =
        "/GroupMessages?entityID=" + _entityID + "&entityName=" + groupName;
      document.location.href = newURL;
    } else {
      console.log("Some error occurred, please try again!");
    }
    // ********** via Relayer **********
  } else {
    console.log("Proof was not verified. Cannot send message.");
  }
};

const sendFile = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const groupName = queryParams.get("entityName");

  return (
    <div className="w3-container" style={{ marginLeft: "0", paddingLeft: "0" }}>
      {sidebar}

      <div className="w3-main" style={{ marginLeft: "250px" }}>
        <div id="box" className="loading" style={{ display: "none" }}>
          <span>
            Loading...
            <img src="https://i.gifer.com/ZZ5H.gif" alt="loading" />
          </span>
        </div>
        <h1>Send File</h1>

        {/* <h1>Send File to {groupName} Group: </h1> */}

        <div
          id="sendMessageForm"
          className="w3-container w3-card-4 w3-light-grey w3-text-black w3-margin"
        >
          <h2 className="w3-center">Send File to '{groupName}': </h2>

          <div className="w3-row w3-section">
            <div className="w3-col" style={{ width: `${50}px` }}>
              <i className="w3-xxlarge fa fa-file-text-o"></i>
            </div>
            <div className="w3-rest">
              {/* <textarea
                className="w3-input w3-border"
                id="leakMessage"
                name="leakMessage"
                rows="4"
                cols="50"
              /> */}

              <input
                type="file"
                className="w3-input w3-border"
                accept=".jpg, .png, .gif, .heic, .jpeg, .zip, .mp3, .mov, .avi, .wav, .wma, .wmv, .csv, .txt, .doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx"
                id="leakFile"
                name="leakFile"
              />
            </div>{" "}
          </div>
          <button
            onClick={submitFile}
            id="thisButton"
            className="w3-button w3-block w3-section w3-black w3-ripple w3-padding"
          >
            Send File
          </button>
        </div>
      </div>
    </div>
  );
};

export default sendFile;
