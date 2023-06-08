import React from "react";

export const sidebar = (
    <>
    <div
        className="w3-sidebar w3-collapse w3-white w3-animate-left w3-large"
        style={{ zIndex: "3", width: "200px", marginLeft: "0", paddingLeft: "0" }}
        id="mySidebar"
    >
        <div id="nav01" className="w3-bar-block">
            <a
                className="w3-bar-item w3-button w3-border-bottom w3-large"
                href="#"
            >
                <b>zkCommunities</b>
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
            <a className="w3-bar-item w3-button" href="#" href="Administration">
                Administration
            </a>
        </div>
    </div><div
        className="w3-overlay w3-hide-large"
        style={{ cursor: "pointer" }}
        id="myOverlay"
    ></div></>
);