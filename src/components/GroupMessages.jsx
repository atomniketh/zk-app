import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { utils, BigNumber } from "ethers";
import multihash from "multihashes";
import { SemaphoreEthers, SemaphoreSubgraph } from "@semaphore-protocol/data";
import BlockiesSvg from "blockies-react-svg";
import "font-awesome/css/font-awesome.min.css";
import { sidebar } from "./Sidebar";

const semaphoreSubgraph = new SemaphoreSubgraph(process.env.REACT_APP_NETWORK);
const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK, {
  address: process.env.REACT_APP_WBCONTRACT,
  startBlock: 0,
});

function GroupMessages() {
//   const [groupID, setGroupID] = useState("");
  const [groupAdmin, setGroupAdmin] = useState("");
  const [numberOfLeaves, setNumberOfLeaves] = useState("");
  const [numOfMsgs, setNumOfMsgs] = useState("");
  const [verifiedProofs, setVerifiedProofs] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  //   const [url, setUrl] = useState("");
  const [isActiveMember, setIsActiveMember] = useState("");
  const [messagesArr, setMessagesArr] = useState([]);

  const queryParams = new URLSearchParams(window.location.search);
  const groupIDNum = queryParams.get("entityID");
  const groupToJoin = `group${groupIDNum}`;
  const activeCommitment = localStorage.getItem(groupToJoin);

  const groupName = queryParams.get("entityName");
  const entID = queryParams.get("entityID");
  const urlMessage = new URL("/SendMessage", window.location);
  urlMessage.searchParams.set("entityID", entID);
  urlMessage.searchParams.set("entityName", groupName);
  const urlFiles = new URL("/SendFile", window.location);
  urlFiles.searchParams.set("entityID", entID);
  urlFiles.searchParams.set("entityName", groupName);

  async function getAdmin() {
    const admin = await semaphoreEthers.getGroupAdmin(groupIDNum);
    setGroupAdmin(admin);
    setIsActiveMember("false");
    // const urlLink = `https://goerli.etherscan.io/address/${groupAdmin}`;
    // setUrl(urlLink);
  }

  async function getGroup() {
    const groupData = await semaphoreEthers.getGroup(groupIDNum);
    // setGroupID(groupIDNum);
    setNumberOfLeaves(groupData.merkleTree.numberOfLeaves.toString());
  }

  async function getGroupMembers() {
    const groupMembers = await semaphoreEthers.getGroupMembers(groupIDNum);
    setAllMembers(groupMembers);
  }

  async function getIsGroupMember() {
    const isGroupMember = await semaphoreSubgraph.isGroupMember(
      groupIDNum,
      activeCommitment
    );
    setIsActiveMember(isGroupMember);
  }

  async function getVerifiedProofs() {
    const verifiedProofs = await semaphoreEthers.getGroupVerifiedProofs(
      groupIDNum
    );
    // setVerifiedProofs(verifiedProofs);
    setNumOfMsgs(verifiedProofs.length);
    const theMessages = [];
    for (let index = 0; index < verifiedProofs.length; index++) {
      // **************************************************************
      // Convert the signal back to the original CID
      const tmpBNtoHex = utils.hexlify(
        BigNumber.from(verifiedProofs[index].signal)
      );
      const tmpHextoBytes = utils.arrayify(tmpBNtoHex);
      const tmpBytestoArr = multihash.encode(tmpHextoBytes, "sha2-256");
      const mhBuf = multihash.encode(tmpBytestoArr, "sha2-256");
      const decodedBuf = multihash.decode(mhBuf);
      const encodedStr = multihash.toB58String(decodedBuf.digest);
      // console.log("Recovered CID Value: ", encodedStr);
      // **************************************************************
      theMessages[index] = encodedStr;
    }
    setVerifiedProofs(theMessages);
  }

  useEffect(() => {
    getAdmin();
    getGroup();
    getGroupMembers();
    getIsGroupMember();
    getVerifiedProofs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isActiveMember === "true") {
    window.location.href = "/MyGroups";
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const newMessagesArr = [];
      for (let i = 0; i < verifiedProofs.length; i++) {
        const ipfsURL = process.env.REACT_APP_IPFS_URL + verifiedProofs[i];
        try {
          const response = await fetch(ipfsURL);
          if (response.ok) {
            const contentType = response.headers.get("Content-Type");
            // console.log('content type', contentType);
            switch (contentType) {
              case "image/png":
              case "image/jpeg":
                // case "image/jp2":
                newMessagesArr[
                  i
                ] = `<img src='${ipfsURL}' alt='Image' width='200' />`;
                break;
              case "application/json":
                const { value } = await response.json();
                newMessagesArr[i] = value;
                break;
              default:
                newMessagesArr[
                  i
                ] = `<a href='${ipfsURL}' target='_blank' rel='noopener noreferrer'>Click here to view ${contentType.substring(
                  contentType.lastIndexOf("/") + 1
                )}</a>`;
                break;
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      setMessagesArr(newMessagesArr);
    //   console.log("value of messagesArr", newMessagesArr);
    };

    fetchMessages();
  }, [verifiedProofs]);

  return (
    <>
      <div
        className="w3-container"
        style={{ marginLeft: "0", paddingLeft: "0" }}
      >
        {sidebar}
      </div>
      <div className="w3-main" style={{ marginLeft: "205px" }}>
        <h1>{groupName} Messages</h1>
        <table className="w3-table-all">
          <tbody>
            <tr>
              <td>
                <strong>Group Admin:</strong>
              </td>
              <td>
                {/* <a href={this.state.url}>{this.state.groupAdmin}</a> */}
                <Link
                  to={`/MessageAdmin?entityID=${entID}&entityName=${groupName}`}
                >
                  {groupAdmin}
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                <strong>{numberOfLeaves} Group Members:</strong>
              </td>
              <td>
                <table className="w3-table-all">
                  <tbody>
                    <tr>
                      <td>
                        {allMembers.map((value, theIndex) => (
                          <React.Fragment key={theIndex}>
                            <BlockiesSvg
                              onClick={() =>
                                (document.getElementById(
                                  theIndex
                                ).style.display = "block")
                              }
                              address={value}
                              size={12}
                              scale={5}
                              bgcolor="white"
                              className="rounded"
                              title={value}
                            />
                            <div id={theIndex} className="w3-modal">
                              <div className="w3-modal-content w3-animate-top w3-card-4">
                                <span
                                  onClick={() =>
                                    (document.getElementById(
                                      theIndex
                                    ).style.display = "none")
                                  }
                                  className="w3-button w3-display-topright"
                                >
                                  &times;
                                </span>
                                Commitment is:<br></br>
                                {value}
                              </div>
                            </div>
                            {theIndex % 4 === 3 ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: "</td></tr><td>",
                                }}
                              />
                            ) : null}
                          </React.Fragment>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <strong>{numOfMsgs} Messages:</strong>
              </td>
              <td id="allMessages">
                <ul className="w3-ul" id="my-list">
                  {messagesArr && messagesArr.length > 0 ? (
                    <>
                      {messagesArr.map((value, index) => (
                        <React.Fragment key={index}>
                          <li className="w3-xlarge w3-monospace">
                            {typeof value === "string" ? (
                              value.indexOf("<") === -1 ? (
                                value
                              ) : (
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: value,
                                  }}
                                ></span>
                              )
                            ) : (
                              value
                            )}
                          </li>
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    <p>Loading messages...</p>
                  )}
                </ul>
                {/* </> */}
              </td>
            </tr>
          </tbody>
        </table>
        <br></br>
        <div className="w3-right-align">
          <Link to={urlMessage.toString()}>
            <i className="w3-xlarge fa fa-pencil-square-o"></i> Send Message
          </Link>
          {" | "}
          <Link to={urlFiles.toString()}>
            <i className="w3-xlarge fa fa-file-text-o"></i> Send File
          </Link>
        </div>
        <br /> <br />
      </div>
      <br /> <br />
      {/* </div> */}
    </>
  );
}

export default GroupMessages;
