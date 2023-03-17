//import { group } from "console";
import React from "react";
import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { utils } from "ethers"

// const externalNullifier = group.root
// const signal = 1

// greet 
// bytes32 greeting,
// uint 256 merkleTreeRoot,
// uint 256 nullifierHash,
// uint[8] calldata proof

async function test() {
  const identity = new Identity();
  console.log("Identity: " + identity);
  const group = new Group("444");
  console.log("Group: " + group);
  const externalNullifier = utils.formatBytes32String("Topic");
  console.log("External Nullifier: " + externalNullifier);
  const signal = utils.formatBytes32String("Hello world");
  console.log("Signal: " + signal);
  group.addMember([identity.generateCommitment()]);
  console.log("Members: " + group.members);
  const fullProof = await generateProof(identity, group, externalNullifier, signal);
  console.log("FullProof: " + fullProof);
}

const Feedback = () => {
  test();
  return (
    <div>
      <h1>Feedback Page</h1>
      <br />
      <ul>
        <li>
          {/* Endpoint to route to Identities component */}
          <Link to="/">Identities</Link>
        </li>
        <li>
          {/* Endpoint to route to Groups component */}
          <Link to="/Groups">On-Chain Groups</Link>
        </li>
        <li>
          {/* Endpoint to route to Groups component */}
          <Link to="/OffchainGroups">Off-Chain Groups</Link>
        </li>
        <li>
          {/* Endpoint to route to Feedback component */}
          <Link to="/Feedback">Send Feedback</Link>
        </li>
      </ul>

    </div>
  );
};

export default Feedback;