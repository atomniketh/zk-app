import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";

const semaphoreCommunitiesAddress =
  "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";

class ComponentPage extends React.Component {
  constructor() {
    super();
    this.state = {
      // groupID: '',
      // groupAdmin: '',
      // root: '',
      // depth: '',
      // zeroValue: '',
      // numberOfLeaves: '',
      // numOfMsgs: '',
      // verifiedProofs: [],
      allGroups: [],
      currentVerifierContract: "",
    };
  }

  async componentDidMount() {
    try {
      //  const groupIDNum = "555556";
      //  // const groupIDs = await semaphoreEthers.getGroupIds();
      //  // console.log(groupIDs);
      //  const admin = await semaphoreEthers.getGroupAdmin(groupIDNum);
      //  this.setState({ groupAdmin: admin });
      //  const urlLink = "https://goerli.etherscan.io/address/" + this.state.groupAdmin;
      //  this.setState({url: urlLink});

      //  await semaphoreEthers.getGroup(groupIDNum).then((result) => {
      //    this.setState({ groupID: result.id });
      //    let obj = result.merkleTree;
      //    this.setState({ root: obj.root });
      //    this.setState({ depth: obj.depth });
      //    this.setState({ zeroValue: obj.zeroValue });
      //    this.setState({ numberOfLeaves: obj.numberOfLeaves });
      //  });

      //  await semaphoreEthers
      //    .getGroupMembers(groupIDNum)
      //    .then((allMembers) => {
      //      this.setState({ allMembers });
      //    });

      //  await semaphoreEthers
      //    .getGroupVerifiedProofs(groupIDNum)
      //    .then((verifiedProofs) => {
      //     this.setState({ numOfMsgs: verifiedProofs.length });

      //     const theMessages = [];
      //      for (let index = 0; index < verifiedProofs.length; index++) {
      //          theMessages[index] = Web3.utils.hexToAscii(Web3.utils.toHex(verifiedProofs[index].signal));
      //     }
      //     this.setState({ verifiedProofs:theMessages });
      //    }, []);

      let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        semaphoreCommunitiesAddress,
        SemaphoreCommunitiesABI.abi,
        signer
      );
      const verifierAddress = await contract.verifier();
      console.log("verifierAddress is: " + verifierAddress);
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
        // console.log(`idEntity is ${groupInfo.idEntity}`);
      }
      this.setState({ allGroups });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { allGroups } = this.state;
    const { currentVerifierContract } = this.state;
    return (
      <div>
        <h1>All Groups Page</h1>
        <br />
        <Link to="/">Identities</Link> |{" "}
        <Link to="/Groups">On-Chain Groups</Link> |{" "}
        <Link to="/OffchainGroups">Off-Chain Groups</Link> |{" "}
        <Link to="/SendFeedback">Send Feedback</Link> |{" "}
        <Link to="/CreateGroup">Create Group</Link> |{" "}
        <Link to="/UpdateVerifierContract?addr=">Update Verifier Contract</Link>
        <table border="1">
          <tbody>
            <tr>
              <td>Group ID</td>
              <td>Group Name</td>
              <td>Group Editor Address</td>
            </tr>

            {this.state.allGroups.map((item, index) => (
              // Without the `key`, React will fire a key warning
              <React.Fragment key={item.idEntity.toString()}>
                <tr>
                  <td>{item.idEntity.toString()}</td>
                  {/* <td>{ index } is {item.entityName.toString()} <a href={`UpdateGroupName?index=${index}`} >Edit</a></td> */}
                  <td>{item.entityName.toString()} <a href={`/UpdateGroupName?index=${index}&entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`} >Edit</a></td>
                  {/* <td>{item.entityEditor.toString()}</td> */}
                  <td>{item.entityEditor.toString()} <a href={`/UpdateEditor?index=${index}&entityID=${item.idEntity.toString()}&entityEditor=${item.entityEditor.toString()}`} >Edit</a></td>

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