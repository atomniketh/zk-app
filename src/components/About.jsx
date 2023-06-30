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
          flexDirection: "column",
          height: "100vh",
          marginLeft: "250px",
        }}
      >
        <h3>
          Using zero knowledge, StealthComms allows users to prove their
          membership of a group and send messages without revealing their
          original identity.
        </h3>
        <p>StealthComms Groups: A group is a binary incremental Merkle tree in which each leaf contains an identity commitment for a user. The identity commitment proves that the user is a group member without revealing the StealthComms identity of the user. StealthComms uses the Poseidon hash function to create Merkle trees.</p>
<p>About the code: StealthComms was built on top of the Semaphore protocol. The core of the protocol is the circuit logic. In addition to circuits, Semaphore provides Solidity contracts and JavaScript libraries that allow developers to generate zero-knowledge proofs and verify them with minimal effort.</p>
<p>Trusted Setup Ceremony: The secure parameters for generating valid proofs with Semaphore circuits were generated in a <a href="https://storage.googleapis.com/trustedsetup-a86f4.appspot.com/semaphore/semaphore_top_index.html">Trusted Setup Ceremony</a> that was completed with over 300 participants on 29 March 2022.</p>

      </div>
    </div>
  );
}

export default AboutScreen;
