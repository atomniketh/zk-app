/* eslint-disable no-console */
import React from "react";
// import { Link } from "react-router-dom";
import { ethers, utils, BigNumber } from "ethers";
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
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const submitMessage = async () => {
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
  // console.log("Auth String is: " + auth);
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
  const text = document.getElementById("leakMessage").value;
  //const data = JSON.stringify({ value: text });
  //const fileHash = await client.add({ content: data });
  const jsonFile = new Blob([JSON.stringify({ value: text })], {
    type: "application/json",
  });
  const fileHash = await client.add(jsonFile);
  const theCID = fileHash.cid.toString();
  //   const contentD = contentHash.decode(hashedContent);
  //   console.log(`Content Hash Decoded: ${contentD}`);

  // **************************************************************
  // **************** End of IPFS Section ***************
  // **************************************************************

  // **************************************************************
  // **************** Convert CID to Big Number ***************
  // requires CID from ipfs-http-client, multihash and ethers
  console.log("Origin CID: ", CID.parse(theCID).toString());
  const tmpArray = multihash.fromB58String(CID.parse(theCID).toString());
  const b58decoded = multihash.decode(tmpArray).digest;
  const tmpHexStr = utils.hexlify(b58decoded);
  const tmpSignal = BigNumber.from(tmpHexStr, 16).toString();
  console.log("Signal to use: ", tmpSignal);
  // **************************************************************

  // **************************************************************
  // Convert the signal back to the original CID
  const tmpBNtoHex = utils.hexlify(BigNumber.from(tmpSignal));
  const tmpHextoBytes = utils.arrayify(tmpBNtoHex);
  const tmpBytestoArr = multihash.encode(tmpHextoBytes, "sha2-256");
  const mhBuf = multihash.encode(tmpBytestoArr, "sha2-256");
  const decodedBuf = multihash.decode(mhBuf);
  const encodedStr = multihash.toB58String(decodedBuf.digest);
  console.log("Recovered CID Value: ", encodedStr);
  // **************************************************************

  // const signalCID = BigNumber.from(
  //   newCID.toString()
  // ).toString();
  // console.log("Signal CID: ", signalCID);

  // eslint-disable-next-line no-undef
  const group = new Group(parseInt(_entityID, 10), 20);
  // const signal = BigNumber.from(
  //   utils.formatBytes32String(document.getElementById("leakMessage").value)
  // ).toString();

  console.log("Formatted Signal: " + tmpSignal);

  // console.log(
  //   `localStorage.getItem(signedData${_entityID}): ${localStorage.getItem(
  //     "signedData" + _entityID
  //   )}`
  // );

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
  // console.log(`random string: ${result}`);
  // console.log(`externalNullifer: ${externalNullifier}`);

  const allMembers = await semaphoreEthers.getGroupMembers(_entityIDStr);
  group.addMembers(allMembers);
  // console.log(`allMembers: ${allMembers}`);
  // console.log(`ID Commitment: ${identity.commitment}`);

  const idIndex = group.indexOf(identity.commitment);
  // const activeCommitment = localStorage.getItem(groupToJoin);
  // console.log(`Active Commitment: ${activeCommitment}`);

  // console.log(`idIndex: ${idIndex}`);
  // console.log(`Group Members: ${group.members}`);

  // const groupProof = group.generateMerkleProof(idIndex);
  const thisIdsGroupMerkleProof = group.generateMerkleProof(idIndex);

  // console.log(`groupProof leaf: ${thisIdsGroupMerkleProof.leaf}`);
  // console.log(`groupProof root: ${thisIdsGroupMerkleProof.root}`);
  // console.log(`_entityID: ${_entityID}`);

  // console.log("******* Group Info: *********************************");
  // console.log(`GroupID: ${group.id}`);
  // console.log(`Group Root: ${group.root}`);
  // console.log(`Group Depth: ${group.depth}`);
  // console.log(`Group zeroValue: ${group.zeroValue}`);
  // console.log(`Group MerkleProof: ${thisIdsGroupMerkleProof}`);
  // console.log(`Group MerkleProof Leaf: ${thisIdsGroupMerkleProof.leaf}`);
  // console.log(`Group MerkleProof Root: ${thisIdsGroupMerkleProof.root}`);
  // console.log("*******  End of Group Info *********************************");

  await provider.send("eth_requestAccounts", []);
  const contract = new ethers.Contract(
    semaphoreContractAddress,
    SemaphoreContractABI.abi,
    signer
  );

  // const groupMTRoot = await contract.getMerkleTreeRoot(_entityID);
  // console.log(`GroupMTRoot from on-chain: ${groupMTRoot}`);

  // if (groupMTRoot == thisIdsGroupMerkleProof.root) {
  //   console.log("The Roots match, message can be sent.");
  // } else {
  //   console.log("The Roots DO NOT match, message can not be sent.");
  // }

  // console.log(`Raw is: ${typeof groupMTRoot}`);
  // eslint-disable-next-line no-undef
  // const groupMTRootInt = BigInt(groupMTRoot);
  // console.log(`Int is: ${typeof groupMTRootInt}`);
  // const groupMTDepth = await contract.getMerkleTreeDepth(_entityID);
  // console.log(`GroupMTDepth: ${groupMTDepth}`);

  // console.log("******* Generating Proof With: *********************************");
  // console.log(`identity: ${identity}`);
  // console.log(`thisIdsGroupMerkleProof: ${thisIdsGroupMerkleProof}`);
  // console.log(`externalNullifier: ${externalNullifier}`);
  // console.log(`signal: ${signal}`);
  // console.log("*******  End of Generating Proof With: *********************************");

  const fullProof = await generateProof(
    identity,
    group,
    externalNullifier,
    tmpSignal
  );

  const vProof = await verifyProof(fullProof, 20);
  // console.log(`Verified Proof: ${vProof}`);

  if (vProof) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const nonce = await signer.getTransactionCount();

    // console.log("******* Publishing Signal With: *********************************");
    // console.log(`groupId: ${_entityID}`);
    // console.log(`thisIdsGroupMerkleProof.root: ${thisIdsGroupMerkleProof.root}`);
    // console.log(`Which matches GroupMTRoot from on-chain: ${groupMTRoot}`);
    // console.log(`Proofs merkleTreeRoot: ${fullProof.merkleTreeRoot}`);
    // console.log(`signal: ${signal}`);
    // console.log(`fullProof.nullifierHash: ${fullProof.nullifierHash}`);
    // console.log(`externalNullifier: ${externalNullifier}`);
    // console.log(`fullProof.proof: ${fullProof.proof}`);
    // console.log("*******  End of Publishing Leak With: *********************************");

    // const credentials = { apiKey: process.env.REACT_APP_OZ_API_KEY, apiSecret: process.env.REACT_APP_OZ_SEC_KEY };
    // const OZprovider = new DefenderRelayProvider(credentials);
    // const OZsigner = new DefenderRelaySigner(credentials, OZprovider, { speed: 'fast' });

    // const OZcontract = new ethers.Contract(
    //   process.env.REACT_APP_OZ_ETH_ADDRESS,
    //   SemaphoreContractABI.abi,
    //   OZsigner
    // );

    const tx = await contract.verifyProof(
      _entityID,
      thisIdsGroupMerkleProof.root,
      tmpSignal,
      fullProof.nullifierHash,
      externalNullifier,
      fullProof.proof,
      { gasLimit: 1000000, nonce: nonce || undefined }
    );
    console.log(`Transaction hash: https://goerli.etherscan.io/tx/${tx.hash}`);
    document.getElementById("leakMessage").value = "";
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    const newURL =
      "/Messages?entityID=" + _entityID + "&entityName=" + groupName;
    console.log(`New URL: ${newURL}`);
    document.location.href = newURL;
  } else {
    console.log("Proof was not verified. Cannot send message.");
  }
};

const sendMessage = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const groupName = queryParams.get("entityName");
  // const groupIDNum = queryParams.get("entityID");
  // const groupToJoin = `group${groupIDNum}`;

  // console.log(
  //   `Identity now in local storage is: ${localStorage.getItem(groupToJoin)}`
  // );

  // if (localStorage.getItem(groupToJoin) === null) {
  //   console.log(`Identity is null`);
  // } else {
  //   console.log(
  //     `Identity is stored as: ${localStorage.getItem(groupToJoin)}`
  //   );
  // }

  return (
    <div className="w3-container" style={{ marginLeft: "0", paddingLeft: "0" }}>
      {sidebar}

      <div className="w3-main" style={{ marginLeft: "250px" }}>
        <h1>Send Message</h1>

        {/* <h1>Send Message to {groupName} Group: </h1> */}

        <div
          id="sendMessageForm"
          className="w3-container w3-card-4 w3-light-grey w3-text-black w3-margin"
        >
          <h2 className="w3-center">Send Message to '{groupName}' Group: </h2>

          <div className="w3-row w3-section">
            <div className="w3-col" style={{ width: `${50}px` }}>
              <i className="w3-xxlarge fa fa-envelope-o"></i>
            </div>
            <div className="w3-rest">
              <textarea
                className="w3-input w3-border"
                id="leakMessage"
                name="leakMessage"
                rows="4"
                cols="50"
              />
            </div>{" "}
          </div>
          <button
            onClick={submitMessage}
            className="w3-button w3-block w3-section w3-black w3-ripple w3-padding"
          >
            Submit Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default sendMessage;
