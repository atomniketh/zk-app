/* eslint-disable no-console */
import React from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;

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
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        semaphoreCommunitiesAddress,
        SemaphoreCommunitiesABI.abi,
        signer
      );
      const verifierAddress = await contract.semaphore();
      // console.log("verifierAddress is: " + verifierAddress);
      this.setState({ currentVerifierContract: verifierAddress });

      const numberOfEntities = await contract.getNumberOfEntities();
      // console.log("Number of Entities: " + numberOfEntities);
      // const verifierAddress = await contract.verifier();
      // console.log("verifierAddress is: " + verifierAddress);

      const allGroups = [];
      let groupInfo;
      let groupMTRoot;
      let groupMTDepth;
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < numberOfEntities; index++) {

        groupInfo = await contract.allEntities(index);
        groupMTRoot = await contract.getMerkleTreeRoot(groupInfo.idEntity);
        groupMTDepth = await contract.getMerkleTreeDepth(groupInfo.idEntity);
        allGroups[index] = groupInfo;
        // allGroups[index] = groupMTRoot;
        console.log(`Group ${groupInfo.idEntity} MerkleTreeRoot: ${groupMTRoot} MerkleTreeDepth: ${groupMTDepth}`);
        // console.log(groupInfo);
        // console.log(`entityName is ${groupInfo.entityName}`);
        // console.log(`entityEditor is ${groupInfo.entityEditor}`);
        // console.log(`idEntity is ${groupInfo.root}`);
      }
      this.setState({ allGroups });
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   const checkGroupInfo = async () => {
    //     const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    //     await provider.send("eth_requestAccounts", []);
    //     const signer = provider.getSigner();
    //     const contract = new ethers.Contract(
    //       semaphoreCommunitiesAddress,
    //       SemaphoreCommunitiesABI.abi,
    //       signer
    //     );
    //     // eslint-disable-next-line no-undef
    //     document.getElementById("theProof").value = await contract.getMerkleTreeRoot(item.idEntity);
    // }
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
          Current Semaphore Contract Address is: {currentVerifierContract}  <Link to="/UpdateVerifierContract?addr=">(Update)</Link>
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
                  <td>{item.entityName.toString()} {" "} {item.root}
                  </td>

                  <td> <a href={`/CreateIdentity?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}&entityEditor=${item.entityEditor.toString()}`}>Request Access</a> | <a href={`/SendMessage?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`}>Send Message</a> | <a href={`/Messages?entityID=${item.idEntity.toString()}`}>See Messages</a></td>
                  <td> <a href={`/UpdateGroupName?index=${index}&entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`} >Rename</a> | <a href={`/UpdateEditor?entityID=${item.idEntity.toString()}`} >Reassign</a> | <a href={`/AddMember?entityID=${item.idEntity.toString()}&entityEditor=${item.entityEditor.toString()}&entityName=${item.entityName.toString()}`}>Add Member</a> | Remove Member </td>
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