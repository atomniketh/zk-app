/* eslint-disable no-console */
import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { sidebar } from "./Sidebar";
import { SemaphoreSubgraph, SemaphoreEthers } from "@semaphore-protocol/data";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";
import BlockiesSvg from 'blockies-react-svg';

const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;
const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK, {
  address: process.env.REACT_APP_WBCONTRACT,
  startBlock: 0,
});

class ComponentPage extends React.Component {
  constructor() {
    super();
    this.state = {
      allGroups: [],
      myGroups: [],
      allMembers: [],
      allGroupsInfo: [],
      currentVerifierContract: "",
      isActiveMember: "",
      accountAddress: ""
    };
  }

  async componentDidMount() {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        semaphoreCommunitiesAddress,
        SemaphoreCommunitiesABI.abi,
        signer
      );
      const accountAddress = await signer.getAddress();
      this.setState({ accountAddress });

      // console.log(accountAddress);
      const verifierAddress = await contract.semaphore();
      // console.log("verifierAddress is: " + verifierAddress);
      this.setState({ currentVerifierContract: verifierAddress });

      const numberOfEntities = await contract.getNumberOfEntities();
      // console.log("Number of Entities: " + numberOfEntities);
      // const verifierAddress = await contract.verifier();
      // console.log("verifierAddress is: " + verifierAddress);

      const allGroups = [];
      let groupInfo;
      for (let index = 0; index < numberOfEntities; index++) {
        groupInfo = await contract.allEntities(index);
        allGroups[index] = groupInfo;
      }
      this.setState({ allGroups });

      let allGroupsInfo = [];
      const semaphoreSubgraph = new SemaphoreSubgraph(process.env.REACT_APP_NETWORK);

      for (let i = 0; i < allGroups.length; i++) {
        try {
          let groupToJoin = `group${allGroups[i].idEntity.toString()}`;
          let GroupInfo = {
            groupID: allGroups[i].idEntity.toString(),
            userCommitment: localStorage.getItem(groupToJoin),
            groupAdmin: await semaphoreSubgraph.getGroup(allGroups[i].idEntity.toString(), {
              admin: true,
            }),
            allGroupMembers: await semaphoreEthers.getGroupMembers(
              allGroups[i].idEntity.toString()
            ),
          };
          allGroupsInfo.push(GroupInfo);
          //  console.log('groupAdmin: ', GroupInfo.groupAdmin)
          this.setState({ allGroupsInfo });
        } catch (error) {
          console.log("Error: " + error);
        }
      }

      const myGroups = [];
      for (let i = 0; i < allGroupsInfo.length; i++) {
        let groupToJoin = `group${allGroups[i].idEntity.toString()}`;
        const foundGroups = allGroupsInfo.filter((groupInfo) => {
          return groupInfo.allGroupMembers.some((member) =>
            member.includes(localStorage.getItem(groupToJoin))
          );
        });
        for (let foundGroup of foundGroups) {
          myGroups.push(foundGroup.groupID);
        }
      }
      // console.log("myGroups: " + myGroups);
      this.setState({ myGroups });

    } catch (error) {
      console.error(error);
    }
  }



  render() {
    // const { allGroups } = this.state;
    const { currentVerifierContract } = this.state;
let tmpGroupAdmin = [];


    return (
      <>
        <div
          className="w3-container"
          style={{ marginLeft: "0", paddingLeft: "0" }}
        >
          {sidebar}

          <div className="w3-main" style={{ marginLeft: "250px" }}>
            <h1>All Groups</h1>
            <p>
              Current Semaphore Contract Address is: {currentVerifierContract}{" "}
              <Link to="/UpdateVerifierContract?addr=">(Update)</Link>
            </p>
            <table className="w3-table-all">
              <tbody>
                <tr>
                  <td>Group ID</td>
                  <td>Group Name</td>
                  {/* <td>Group Editor Address</td> */}
                  <td>Functions</td>
                  <td></td>
                </tr>
                {this.state.allGroups.map((item, index) => (
                  // eslint-disable-next-line no-sequences
                  tmpGroupAdmin = this.state.allGroupsInfo.filter(id => id.groupAdmin.id === item.idEntity.toString()).map((item, index) => (item.groupAdmin.admin)),
                  <React.Fragment key={item.idEntity.toString()}>
                    <tr>
                      <td>
                        {<BlockiesSvg
                          address={item.idEntity.toString()}
                          size={8}
                          scale={5}
                          defaultBackgroundColor='red'
                        />}
                      </td>
                      <td>
                        {item.entityName.toString()} {item.root}
                      </td>
                      <td>
                        {this.state.myGroups.includes(item.idEntity.toString()) ? (
                          <span>
                          <a href={`/SendMessage?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`} > Send Message</a> | <a href={`/Messages?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`} > See Messages</a>
                          </span>)
                          : (
                            <a href={`/CreateIdentity?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}&entityEditor=${item.entityEditor.toString()}`} > Request Access</a>)
                        }

                      </td>
                      {/* { console.log('Address is:', index, 'for: ', this.state.accountAddress.toLowerCase()) } */}
                      {tmpGroupAdmin[0] === this.state.accountAddress.toLowerCase() ? (
                        <td>
                          {" "}
                          <a
                            href={`/UpdateGroupName?index=${index}&entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`}
                          >
                            Rename
                          </a>{" "}
                          |{" "}
                          <a
                            href={`/UpdateEditor?entityID=${item.idEntity.toString()}`}
                          >
                            Reassign
                          </a>{" "}
                          |{" "}
                          <a
                            href={`/AddMember?entityID=${item.idEntity.toString()}&entityEditor=${item.entityEditor.toString()}&entityName=${item.entityName.toString()}`}
                          >
                            Add Member
                          </a>{" "}
                          | Remove Member{" "}
                        </td>
                      ) : (
                        <><td>
                          <Link
                              to={`/MessageAdmin?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`}
                            >
                              Send Admin a Message.
                            </Link></td></>
                      )}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <footer
              className="w3-container w3-padding-large w3-light-grey w3-justify w3-opacity"
              style={{ position: "absolute", bottom: "0" }}
            >
              <div>
                <nav>
                  Report a Bug.
                </nav>
              </div>
            </footer>
          </div>
        </div>
      </>
    );
  }
}

export default ComponentPage;
