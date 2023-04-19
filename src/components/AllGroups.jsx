import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";
require('dotenv').config();
console.log("Connecting to " + process.env.NODE_ENV);
console.log("process.env.REACT_APP_CONTRACT is: " + process.env.REACT_APP_CONTRACT);
const semaphoreCommunitiesAddress = "0x233bd7b6de74e3029ffe1dac7fd2fcb2fdf9386c";

//"0x33F97669eD732Fa05924015863772118C9D4e236";
 // "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";

class ComponentPage extends React.Component {
  constructor() {
    super();
    this.state = {
      allGroups: [],
      currentVerifierContract: "",
    };
  }

  async componentDidMount() {
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        semaphoreCommunitiesAddress,
        SemaphoreCommunitiesABI.abi,
        signer
      );
      const verifierAddress = await contract.verifier();
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
        //console.log(groupInfo);
        // console.log(`entityName is ${groupInfo.entityName}`);
        // console.log(`entityEditor is ${groupInfo.entityEditor}`);
        console.log(`idEntity is ${groupInfo.root}`);
      }
      this.setState({ allGroups });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    // const { allGroups } = this.state;
    const { currentVerifierContract } = this.state;

    return (

      <div className="w3-container">
        <h1>All Groups Page</h1>
        <br />
        <Link to="/">Identities</Link> |{" "}
        <Link to="/Groups">On-Chain Groups</Link> |{" "}
        <Link to="/OffchainGroups">Off-Chain Groups</Link> |{" "}
        <Link to="/SendFeedback">Send Feedback</Link> |{" "}
        <br />
        <Link to="/CreateGroup">Create Group</Link> |{" "}
       
<p>
Current Verifier Contract Address is: { currentVerifierContract }  <Link to="/UpdateVerifierContract?addr=">(Update)</Link>
</p>
        <table className="w3-table-all">
          <tbody>
            <tr>
              <td>Group ID</td>
              <td>Group Name</td>
              {/* <td>Group Editor Address</td> */}
              <td>User Functions</td>
              <td>Group Admin Functions</td>

            </tr>

            {this.state.allGroups.map((item, index) => (
              // Without the `key`, React will fire a key warning
              <React.Fragment key={item.idEntity.toString()}>
                <tr>
                  <td>{item.idEntity.toString()}</td>
                  <td>{item.entityName.toString()}</td>
                  {/* <td>{item.entityEditor.toString()}</td> */}
                  <td> <a href={`/CreateIdentity?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}&entityEditor=${item.entityEditor.toString()}`}>Request Access</a> | <a href={`/SendMessage?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`}>Send Message</a> | See Messages</td>
                  <td> <a href={`/UpdateGroupName?index=${index}&entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`} >Rename</a> | <a href={`/UpdateEditor?index=${index}&entityID=${item.idEntity.toString()}&entityEditor=${item.entityEditor.toString()}`} >Reassign</a> | <a href={`/AddMember?entityID=${item.idEntity.toString()}&entityEditor=${item.entityEditor.toString()}&entityName=${item.entityName.toString()}`}>Add Member</a> | Remove Member </td>
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