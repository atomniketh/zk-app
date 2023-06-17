import React from "react";
import { sidebar } from "./Sidebar";

function HomeScreen() {
  return (
    <div className="w3-container" style={{ marginLeft: "0", paddingLeft: "0" }}>
      {sidebar}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Zero Knowledge Messaging</h1>
      </div>
    </div>
  );
}

export default HomeScreen;
