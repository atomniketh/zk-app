/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Link } from "react-router-dom";
import { utils, BigNumber } from "ethers";
import multihash from "multihashes";
import { SemaphoreEthers, SemaphoreSubgraph } from "@semaphore-protocol/data";
import BlockiesSvg from "blockies-react-svg";
import "font-awesome/css/font-awesome.min.css";

// import { utils } from "ethers";
// import Web3 from "web3";
import { sidebar } from "./Sidebar";

const semaphoreSubgraph = new SemaphoreSubgraph(process.env.REACT_APP_NETWORK);
const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK, {
  address: process.env.REACT_APP_WBCONTRACT,
  startBlock: 0,
});
class ComponentPage extends React.Component {
  constructor() {
    super();
    this.state = {
      groupID: "",
      groupAdmin: "",
      root: "",
      depth: "",
      zeroValue: "",
      numberOfLeaves: "",
      numOfMsgs: "",
      verifiedProofs: [],
      allMembers: [],
      url: "",
      isActiveMember: "",
      listItems: [],
    };
  }

  async componentDidMount(props) {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const groupIDNum = queryParams.get("entityID");
      const groupToJoin = `group${groupIDNum}`;

      //  const graphIDs = await semaphoreSubgraph.getGroupIds();
      //  console.log(graphIDs);
      //  const groups = await semaphoreSubgraph.getGroups()
      // console.log(groups);
      // const myGroup = await semaphoreSubgraph.getGroup(groupIDNum, { admin: true, members: true, verifiedProofs: true });
      // console.log(myGroup);
      // console.log(`Group Admin: ${  myGroup.admin}`);
      // console.log(`Group Members: ${  myGroup.members}`);
      // console.log(`Group verifiedProofs: ${  myGroup.verifiedProofs}`);
      // console.log(`Group merkleTree: ${  myGroup.merkleTree}`);
      // console.log(`Group merkleTree.root: ${  myGroup.merkleTree.root}`);
      const admin = await semaphoreEthers.getGroupAdmin(groupIDNum);
      this.setState({ groupAdmin: admin });
      this.setState({ isActiveMember: "false" });
      const urlLink = `https://goerli.etherscan.io/address/${this.state.groupAdmin}`;
      this.setState({ url: urlLink });

      await semaphoreEthers.getGroup(groupIDNum).then((result) => {
        this.setState({ groupID: result.id });
        const obj = result.merkleTree;
        this.setState({ root: obj.root });
        this.setState({ depth: obj.depth });
        this.setState({ zeroValue: obj.zeroValue });
        this.setState({ numberOfLeaves: obj.numberOfLeaves });
      });

      await semaphoreEthers.getGroupMembers(groupIDNum).then((allMembers) => {
        this.setState({ allMembers });
      });

      const activeCommitment = localStorage.getItem(groupToJoin);
      console.log(`Active Commitment: ${activeCommitment}`);
      // const { allMembers } = this.state;
      // for (let i = 0; i < allMembers.length; i++) {
      //   if (allMembers[i] === activeCommitment) {
      //     // console.log(`${ activeCommitment } exists in array`);
      //     this.setState({isActiveMember: 'true'});
      //     break;
      //   }
      // }

      await semaphoreSubgraph
        .isGroupMember(groupIDNum, activeCommitment)
        .then((result) => {
          this.setState({ isActiveMember: result });
        });

      if (!this.state.isActiveMember) {
        window.location.href = "/MyGroups";
      }

      await semaphoreEthers
        .getGroupVerifiedProofs(groupIDNum)
        .then((verifiedProofs) => {
          this.setState({ numOfMsgs: verifiedProofs.length });

          const theMessages = [];
          // eslint-disable-next-line no-plusplus
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
          this.setState({ verifiedProofs: theMessages });
        }, []);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { allMembers } = this.state;
    const { verifiedProofs } = this.state;
    const queryParams = new URLSearchParams(window.location.search);
    const groupName = queryParams.get("entityName");
    const entID = queryParams.get("entityID");
    const url = new URL("/SendMessage", window.location);
    url.searchParams.set("entityID", entID);
    url.searchParams.set("entityName", groupName);

    return (
      <div
        className="w3-container"
        style={{ marginLeft: "0", paddingLeft: "0" }}
      >
        {sidebar}
        <div className="w3-main" style={{ marginLeft: "250px" }}>
          <h1>{groupName} Messages</h1>
          <table className="w3-table-all">
            <tbody>
              {/* <tr>
                <td>
                  <strong>Group Name:</strong>
                </td>
                <td>{groupName}</td>
              </tr> */}
              <tr>
                <td>
                  <strong>Group Admin:</strong>
                </td>
                <td>
                  {/* <a href={this.state.url}>{this.state.groupAdmin}</a> */}
                  <Link
                    to={`/MessageAdmin?entityID=${entID}&entityName=${groupName}`}
                  >
                    {this.state.groupAdmin}
                  </Link>
                </td>
              </tr>
              {/* <tr><td><strong>Merkle Tree Root:</strong></td><td> {this.state.root}</td></tr>
                <tr><td><strong>depth:</strong></td><td> {this.state.depth}</td></tr>
                <tr><td><strong>zeroValue:</strong></td><td> {this.state.zeroValue}</td></tr> */}
              {/* <tr>
                <td>
                  <strong>Number of Group Members:</strong>
                </td>
                <td>{this.state.numberOfLeaves}</td>
              </tr> */}
              <tr>
                <td>
                  <strong>{this.state.numberOfLeaves} Group Members:</strong>
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
                  <strong>{this.state.numOfMsgs} Messages:</strong>
                </td>
                <td>
                  <ul className="w3-ul" id="my-list">
                    { verifiedProofs.map((value, index) => {
                       const ipfsURL = process.env.REACT_APP_IPFS_URL + value;
                      fetch(ipfsURL)
                        .then((response) => response.json())
                        .then((data) => {
                          const root = ReactDOM.createRoot(document.getElementById("my-list"))
                          const jsonValue = data.value;
                          const listItem = React.createElement(
                            "li",
                            { className: "w3-xlarge w3-monospace", key: index },
                            jsonValue
                          );
                          console.log("listItem: ", jsonValue);
                          root.render(listItem);
                        })
                        .catch((error) => console.log(error));
                    })}

                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <div className="w3-right-align">
            <Link to={url.toString()}>
              <i className="w3-xxlarge fa fa-pencil"></i> Send Message
            </Link>
          </div>
          <br /> <br />
        </div>
      </div>
    );
  }
}

export default ComponentPage;
