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
      allMembers: [],
      currentVerifierContract: "",
      isActiveMember: "",
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
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    // const { allGroups } = this.state;
    const { currentVerifierContract } = this.state;

    return (
      <>
        <div className="w3-container"
                    style={{ marginLeft: "0", paddingLeft: "0" }}
                    >
          <div
            className="w3-sidebar w3-collapse w3-white w3-animate-left w3-large"
            style={{ zIndex: "3", width: "300px", marginLeft: "0", paddingLeft: "0" }}
            id="mySidebar"
          >
            <div className="w3-bar w3-black w3-center">
              <a
                className="w3-bar-item w3-button"
                style={{ width: "33.33%" }}
                href="javascript:void(0)"
              >
                <i className="fa fa-bars w3-xlarge"></i>
              </a>
              <a
                className="w3-bar-item w3-button"
                style={{ width: "33.33%" }}
                href="javascript:void(0)"
              >
                <i className="fa fa-file w3-xlarge"></i>
              </a>
              <a
                className="w3-bar-item w3-button"
                style={{ width: "33.33%" }}
                href="javascript:void(0)"
              >
                <i className="fa fa-camera w3-xlarge"></i>
              </a>
            </div>

            <div id="nav01" className="w3-bar-block">
              <a
                className="w3-button w3-hover-teal w3-hide-large w3-large w3-right"
                href="javascript:void(0)"
                onClick={() => document.getElementById("mySidebar").style.display = "none"}
              >×
              </a>
              <a
                className="w3-bar-item w3-button w3-border-bottom w3-large"
                href="#"
              >
                <img
                  src="https://www.w3schools.com/images/w3schools.png"
                  style={{ width: "80%" }}
                ></img>
              </a>
              <a className="w3-bar-item w3-button" href="AllGroups">
                All Groups
              </a>
              <a className="w3-bar-item w3-button" href="MyGroups">
                My Groups
              </a>
              <a className="w3-bar-item w3-button" href="CreateGroup">
                Create Group
              </a>
              <a className="w3-bar-item w3-button" href="#">
                Super User
              </a>
            </div>
          </div>

          <div
            className="w3-overlay w3-hide-large"
            onClick={() => document.getElementById("mySidebar").style.display = "none"}
            style={{ cursor: "pointer" }}
            id="myOverlay"
          ></div>

          <div className="w3-main" style={{ marginLeft: "300px" }}>
            <div className="w3-top w3-theme w3-large w3-hide-large">
              <i
                className="fa fa-bars w3-button w3-teal w3-xlarge"
                onClick={() => document.getElementById("mySidebar").style.display = "block"}
              ></i>
            </div>
            <h1>All Groups Page</h1>
            <br />
            <Link to="/CreateGroup">Create Group</Link> |{" "}
            <Link to="/MyGroups">My Groups</Link>
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
                  <td>User Functions</td>
                  <td>Group Admin Functions</td>
                </tr>
                {this.state.allGroups.map((item, index) => (
                  // Without the `key`, React will fire a key warning
                  <React.Fragment key={item.idEntity.toString()}>
                    <tr>
                      <td>{item.idEntity.toString()}</td>
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
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <footer className="w3-container w3-padding-large w3-light-grey w3-justify w3-opacity" style={{  position: "absolute",
  bottom: "0"}}>
              <div>
                <nav>
                  <a href="/forum/default.asp" target="_blank">
                    FORUM
                  </a>{" "}
                  |
                  <a href="/about/default.asp" target="_top">
                    ABOUT
                  </a>
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
