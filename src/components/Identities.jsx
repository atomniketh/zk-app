import React from "react";
import { Link } from "react-router-dom";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";

const Identities = () => {
  const { trapdoor, nullifier, commitment } = new Identity();
  const group1 = new Group(1);
  //const commitment = identity.generateCommitment()
  group1.addMember(commitment);
//   console.log("Group1: " + group1.indexOf(commitment));

  return (
    <div>
      <h1>Identities Page</h1>
      <Link to="/">Identities</Link> | <Link to="/Groups">On-Chain Groups</Link> | <Link to="/OffchainGroups">Off-Chain Groups</Link> | <Link to="/Messages">Messages</Link> | <Link to="/SendFeedback">Send Feedback</Link>
      <h1>Identity Information</h1>
      <table>
        <tbody>
          <tr>
            <td>Trapdoor:</td>
            <td>{trapdoor.toString()}</td>
          </tr>
          <tr>
            <td>Nullifier:</td>
            <td>{nullifier.toString()}</td>
          </tr>
          <tr>
            <td>Commitment:</td>
            <td>{commitment.toString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Identities;