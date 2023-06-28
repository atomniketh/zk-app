import React from "react";
import "font-awesome/css/font-awesome.min.css";
import { ethers } from "ethers";

async function checkNetwork() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const currentChainId = await provider.getNetwork().then(network => network.chainId);
  // console.log(currentChainId);
  // eslint-disable-next-line eqeqeq
  if (currentChainId == "5") {
    // console.log("Already connected to the Goerli network.");
  } else {
    try {
      const result = await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x5'}]
      });
      console.log("Switched to Goerli.", result);
    } catch (err) {
      console.error("Could not switch to Goerli.", err);
    }
  }
  
}
checkNetwork();


export const sidebar = (
  <>
    <div
      className="w3-sidebar w3-collapse w3-white w3-animate-left w3-large"
      style={{ zIndex: "3", width: "205px", marginLeft: "0", paddingLeft: "0" }}
      id="mySidebar"
    >
      <div id="nav01" className="w3-bar-block">
        <a
          className="w3-bar-item w3-button w3-border-bottom w3-large"
          href="Home"
        ><nobr>
          <i className="w3-large fa fa-comments"></i> 
                    &nbsp;
                    <b>StealthComms</b>
                    </nobr>
        </a>
        <a className="w3-bar-item w3-button" href="AllGroups">
          All Groups
        </a>
        <a className="w3-bar-item w3-button" href="GroupList">
          My Groups
        </a>
        <a className="w3-bar-item w3-button" href="CreateGroup">
          Create Group
        </a>
        <a className="w3-bar-item w3-button" href="Administration">
          Administration
        </a>

        <div id="theFooter" className="footer">
          <a href="about.jsx">About</a>{" "}|{" "}
          <a href="mailto:atomnik.eth@icloud.com?subject=zkComms%20Feedback">
            Send Feedback
          </a>
        </div>
      </div>
    </div>

    <div
      className="w3-overlay w3-hide-large"
      style={{ cursor: "pointer" }}
      id="myOverlay"
    ></div>
  </>
);
