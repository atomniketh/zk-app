import React from 'react';
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers"
import SemaphoreCommunitiesABI from '../abi/SemaphoreCommunities.json';

const semaphoreCommunitiesAddress = "0x8C8382dfA4505fE2d5b3EfC0e994951882A7e5ec";
// 0x461ceCff5896ECDB56946f3A160cd95D368Ba697

async function getGroups() {
let provider = new ethers.providers.Web3Provider(window.ethereum, "any");
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();
let contract = new ethers.Contract(semaphoreCommunitiesAddress, SemaphoreCommunitiesABI.abi, signer);
const numberOfEntities = await contract.getNumberOfEntities();
console.log("Number of Entities: " + numberOfEntities);

const verifierAddress = await contract.verifier();
console.log("verifierAddress is: " + verifierAddress);

const theMessages = [];
let groupInfo;
for (let index = 0; index < numberOfEntities; index++) {
    groupInfo = await contract.allEntities(index);
    console.log(groupInfo);
    console.log(`entityName is ${groupInfo.entityName}`);
    console.log(`entityEditor is ${groupInfo.entityEditor}`);
    console.log(`idEntity is ${groupInfo.idEntity}`);

    //theMessages[index] = Web3.utils.hexToAscii(Web3.utils.toHex(verifiedProofs[index].signal));

}



}
getGroups();
class ComponentPage extends React.Component {
    constructor() {
      super();
      this.state = {
        groupID: '',
        groupAdmin: '',
        root: '',
        depth: '',
        zeroValue: '',
        numberOfLeaves: '',
        numOfMsgs: '',
        verifiedProofs: [],
        allMembers: [],
        url: ''
      }
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
      } catch (error) {
        console.error(error);
      }
    }
  
    render() {
        // const { allMembers } = this.state;
        // const { verifiedProofs } = this.state;
      return (
        <div>
            <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link> | <Link to="/OffchainGroups">Off-Chain Groups</Link> | <Link to="/SendFeedback">Send Feedback</Link>
            <table border="1">
                <tbody>
                  <thead>
                    <td>Group ID</td>
                    <td>Group Name</td>
                    <td>Group Editor Address</td>
                  </thead>
                {/* <tr><td><strong>Group ID:</strong></td><td>{this.state.groupID}</td></tr>
                <tr><td><strong>Group Admin:</strong></td><td><a href={this.state.url}>{this.state.groupAdmin}</a></td></tr>
                <tr><td><strong>Merkle Tree Root:</strong></td><td> {this.state.root}</td></tr>
                <tr><td><strong>depth:</strong></td><td> {this.state.depth}</td></tr>
                <tr><td><strong>zeroValue:</strong></td><td> {this.state.zeroValue}</td></tr>
                <tr><td><strong>numberOfLeaves:</strong></td><td>{this.state.numberOfLeaves}</td></tr> */}
                <tr><td><strong>Group Members:</strong></td>
                <td>
                    {/* {allMembers.map((value) => {
                        return <p key={value}>{value}</p>;
                    })} */}
                </td>
                </tr>
                <tr><td><strong>{this.state.numOfMsgs} Messages:</strong></td>
                <td>
                {/* {verifiedProofs.map((value) => {
                        return <p key={value}>{value}</p>;
                    })} */}
                </td>
                </tr>
                </tbody>
            </table>
        </div>
      );
    }
  }
  
  export default ComponentPage;