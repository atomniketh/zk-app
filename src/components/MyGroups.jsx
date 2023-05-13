/* eslint-disable no-console */
import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { SemaphoreEthers, SemaphoreSubgraph } from "@semaphore-protocol/data";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;
const semaphoreSubgraph = new SemaphoreSubgraph("goerli");
const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK, {
  address: process.env.REACT_APP_WBCONTRACT,
  startBlock: 0,
});

class ComponentPage extends React.Component {
  constructor() {
    super();
    this.state = {
      allGroups: [],
      allMembers: [],
      isActiveMember: "",
      myGroups: []
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

      const numberOfEntities = await contract.getNumberOfEntities();

      const allGroups = [];
      let groupInfo;
      for (let index = 0; index < numberOfEntities; index++) {
        groupInfo = await contract.allEntities(index);
        allGroups[index] = groupInfo;
      }
      this.setState({ allGroups });

      let allGroupsInfo = [];
      // let GroupInfo = {
      //   groupID: '',
      //   userCommittment: '',
      //   allGroupMembers: []
      // };

      for (let i = 0; i < allGroups.length; i++) {
        try {
          let groupToJoin = `group${allGroups[i].idEntity.toString()}`;
          console.log(
            "groupToJoin " +
              groupToJoin +
              " " +
              localStorage.getItem(groupToJoin)
          );
          let GroupInfo = {
            groupID: allGroups[i].idEntity.toString(),
            userCommittment: localStorage.getItem(groupToJoin),
            allGroupMembers: await semaphoreEthers.getGroupMembers(
              allGroups[i].idEntity.toString()
            ),
          };
          allGroupsInfo.push(GroupInfo);
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
      console.log("myGroups: " + myGroups);
      this.setState({ myGroups });
      // Now 'foundGroups' is an array of objects that contained the search string in their allGroupMembers array.
      // You can go through the found groups' objects and log or use their 'groupID' if needed.

      //console.log("foundGroups: " + foundGroups);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    // const { allGroups } = this.state;

    return (
      <div className="w3-container">
        <h1>My Groups</h1>
        <br />
        <Link to="/CreateGroup">Create Group</Link> |{" "}
        <Link to="/MyGroups">My Groups</Link>
        <br />
        <table className="w3-table-all">
          <tbody>
            <tr>
              <td>Group ID</td>
              <td>Group Name</td>
              {/* <td>Group Editor Address</td> */}
              <td>User Functions</td>
            </tr>
            {this.state.allGroups.map((item, index) => (
              // Without the `key`, React will fire a key warning
              <React.Fragment key={item.idEntity.toString()}>
                <tr>

                  <td>{item.idEntity.toString()}
                  {  "blah: " + (this.state.myGroups.includes(item.idEntity.toString())) }
                  </td>
                  <td>
                    {item.entityName.toString()} {item.root}
                  </td>
                  <td>
                    {" "}
                    <a
                      href={`/CreateIdentity?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}&entityEditor=${item.entityEditor.toString()}`}
                    >
                      Request Access
                    </a>{" "}
                    |{" "}
                    <a
                      href={`/SendMessage?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`}
                    >
                      Send Message
                    </a>{" "}
                    |{" "}
                    <a
                      href={`/Messages?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`}
                    >
                      See Messages
                    </a>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ComponentPage;
