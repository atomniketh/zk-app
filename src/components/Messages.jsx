/* eslint-disable no-console */
import React from 'react';
import { Link } from "react-router-dom";
import { SemaphoreEthers } from "@semaphore-protocol/data";
import Blockies from 'react-blockies';
// import { utils } from "ethers";
import Web3 from "web3";

const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK, {
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
        url: '',
        isActiveMember: ''
      }
    }
    
    async componentDidMount() {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const groupIDNum = queryParams.get("entityID");
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
          this.setState({isActiveMember: 'false'});
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

          const activeCommitment = localStorage.getItem("groupToJoin");
          const { allMembers } = this.state;
          for (let i = 0; i < allMembers.length; i++) {
            if (allMembers[i] === activeCommitment) {
              // console.log(`${ activeCommitment } exists in array`);
              this.setState({isActiveMember: 'true'});
              break;
            }
          }
           
         await semaphoreEthers
           .getGroupVerifiedProofs(groupIDNum)
           .then((verifiedProofs) => {            
            this.setState({ numOfMsgs: verifiedProofs.length });

            const theMessages = [];
             // eslint-disable-next-line no-plusplus
             for (let index = 0; index < verifiedProofs.length; index++) {
                 theMessages[index] = Web3.utils.hexToAscii(Web3.utils.toHex(verifiedProofs[index].signal));
                //  try {
                //   console.log(verifiedProofs[index].signal);
                //  } catch (error) {
                //   console.log("Not a hex.");
                //  }
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
        const queryParams = new URLSearchParams(window.location.search);
        const groupName = queryParams.get("entityName");

        const myBlockies = () => <Blockies seed="Jeremy" />;

      return (
        <div>
            <h1>Messages</h1>
      <Link to="/AllGroups">All Groups</Link> {" "}
      <br />      <br />
            <table className="w3-table-all">
                <tbody>
                <tr><td><strong>Group Name:</strong></td><td>{ groupName }</td></tr>
                <tr><td><strong>Group Admin:</strong></td><td><a href={this.state.url}>{this.state.groupAdmin}</a></td></tr>
                {/* <tr><td><strong>Merkle Tree Root:</strong></td><td> {this.state.root}</td></tr>
                <tr><td><strong>depth:</strong></td><td> {this.state.depth}</td></tr>
                <tr><td><strong>zeroValue:</strong></td><td> {this.state.zeroValue}</td></tr> */}
                <tr><td><strong>Number of Group Members:</strong></td><td>{this.state.numberOfLeaves} { this.state.isActiveMember }</td></tr>
                <tr><td><strong>Group Members:</strong></td>
                <td>
                    {allMembers.map((value) => <div key={value}>
                      <Blockies 
                        seed={value} 
                        size={6}
                        scale={5}
                        // bgColor="#aaa"
                        // color="#dfe" 
                        spotColor="#000"
                     />
                      {value }</div>)}
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