/* eslint-disable no-console */
import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { SemaphoreEthers } from "@semaphore-protocol/data";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

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
      allMembers: [],
      isActiveMember: "",
      myGroups: [],
    };
    this.render = this.render.bind(this);
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

      for (let i = 0; i < allGroups.length; i++) {
        try {
          let groupToJoin = `group${allGroups[i].idEntity.toString()}`;
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
      // console.log("myGroups: " + myGroups);
      this.setState({ myGroups });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
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
              <td>Group Name</td>
              {/* <td>Group Editor Address</td> */}
              <td>User Functions</td>
            </tr>
            {this.state.allGroups.map((item, index) => {
              // Without the `key`, React will fire a key warning
              if (this.state.myGroups.includes(item.idEntity.toString())) {
                return (
                  <React.Fragment key={item.idEntity.toString()}>
                    <tr>
                      <td>
                        {item.entityName.toString()} {item.root}
                      </td>
                      <td>
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
                );
              } else {
                return null;
              }
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ComponentPage;