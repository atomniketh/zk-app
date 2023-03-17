import React from "react";
// importing Link from react-router-dom to navigate to 
// different end points.
import { Link } from "react-router-dom";


const Feedback = () => {


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