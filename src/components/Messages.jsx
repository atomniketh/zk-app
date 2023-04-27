/* eslint-disable no-console */
import React from 'react';
import { Link } from "react-router-dom";
import { SemaphoreEthers, SemaphoreSubgraph } from "@semaphore-protocol/data";
import Web3 from "web3";

// const semaphoreEthers = new SemaphoreEthers();
const semaphoreSubgraph = new SemaphoreSubgraph();
const semaphoreEthers = new SemaphoreEthers("goerli", {
  address: process.env.REACT_APP_WBCONTRACT,
  startBlock: 0
})

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
         const groupIDNum = "2";
         const graphIDs = await semaphoreSubgraph.getGroupIds();
         console.log(graphIDs);
         const groups = await semaphoreSubgraph.getGroups()
          console.log(groups);
          const myGroup = await semaphoreSubgraph.getGroup("2", { admin: true, members: true, verifiedProofs: true });
          console.log(myGroup);
          console.log(`Group Admin: ${  myGroup.admin}`);
          console.log(`Group Members: ${  myGroup.members}`);
          console.log(`Group verifiedProofs: ${  myGroup.verifiedProofs}`);
          console.log(`Group merkleTree: ${  myGroup.merkleTree}`);
          console.log(`Group merkleTree.root: ${  myGroup.merkleTree.root}`);
          const admin = await semaphoreEthers.getGroupAdmin(groupIDNum);
          this.setState({ groupAdmin: admin });
          const urlLink = `https://goerli.etherscan.io/address/${  this.state.groupAdmin}`;
          this.setState({url: urlLink});
 
         await semaphoreEthers.getGroup(groupIDNum).then((result) => {
           this.setState({ groupID: result.id });
           const obj = result.merkleTree;
           this.setState({ root: obj.root });
           this.setState({ depth: obj.depth });
           this.setState({ zeroValue: obj.zeroValue });
           this.setState({ numberOfLeaves: obj.numberOfLeaves });
         });

         await semaphoreEthers
           .getGroupMembers(groupIDNum)
           .then((allMembers) => {
             this.setState({ allMembers });
           });

         await semaphoreEthers
           .getGroupVerifiedProofs(groupIDNum)
           .then((verifiedProofs) => {            
            this.setState({ numOfMsgs: verifiedProofs.length });

            const theMessages = [];
             // eslint-disable-next-line no-plusplus
             for (let index = 0; index < verifiedProofs.length; index++) {
                 theMessages[index] = Web3.utils.hexToAscii(Web3.utils.toHex(verifiedProofs[index].signal));
            }
            this.setState({ verifiedProofs:theMessages });
           }, []); 
      } catch (error) {
        console.error(error);
      }
    }
  
    render() {
        const { allMembers } = this.state;
        const { verifiedProofs } = this.state;
      return (
        <div>
            <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link> | <Link to="/OffchainGroups">Off-Chain Groups</Link> | <Link to="/SendFeedback">Send Feedback</Link>
            <table border="1">
                <tbody>
                <tr><td><strong>Group ID:</strong></td><td>{this.state.groupID}</td></tr>
                <tr><td><strong>Group Admin:</strong></td><td><a href={this.state.url}>{this.state.groupAdmin}</a></td></tr>
                <tr><td><strong>Merkle Tree Root:</strong></td><td> {this.state.root}</td></tr>
                <tr><td><strong>depth:</strong></td><td> {this.state.depth}</td></tr>
                <tr><td><strong>zeroValue:</strong></td><td> {this.state.zeroValue}</td></tr>
                <tr><td><strong>numberOfLeaves:</strong></td><td>{this.state.numberOfLeaves}</td></tr>
                <tr><td><strong>Group Members:</strong></td>
                <td>
                    {allMembers.map((value) => <p key={value}>{value}</p>)}
                </td>
                </tr>
                <tr><td><strong>{this.state.numOfMsgs} Messages:</strong></td>
                <td>
                {verifiedProofs.map((value) => <p key={value}>{value}</p>)}
                </td>
                </tr>
                </tbody>
            </table>
        </div>
      );
    }
  }
  
  export default ComponentPage;