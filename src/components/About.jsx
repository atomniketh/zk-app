import React from "react";
import { sidebar } from "./Sidebar";

function AboutScreen() {
  return (
    <div className="w3-container" style={{ marginLeft: "0", paddingLeft: "0" }}>
      {sidebar}
      <div
        className="w3-main"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          marginLeft: "250px",
        }}
      >
        <h3>
          Using zero knowledge, StealthComms allows users to prove their
          membership of a group and send messages without revealing their
          original identity.
        </h3>
      </div>
    </div>
  );
}

export default AboutScreen;
