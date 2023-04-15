import './App.css';
import './w3.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Identities from "./components/Identities";
import Groups from "./components/Groups";
import OffchainGroups from "./components/OffchainGroups";
import SendFeedback from "./components/SendFeedback";
import Messages from "./components/Messages";
import AllGroups from "./components/AllGroups";
import CreateGroup from "./components/CreateGroup";
import UpdateGroupName from "./components/UpdateGroupName";
import UpdateEditor from "./components/UpdateEditor";
import UpdateVerifierContract from "./components/UpdateVerifierContract";
import CreateIdentity from "./components/CreateIdentity";
import AddMember from "./components/AddMember";
import SendMessage from "./components/SendMessage";
// import AddUser from "./components/AddUser";

function App() {
  return (
    <Router>
    <>
      {/* This is the alias of BrowserRouter i.e. Router */}
      <Routes>
          {/* This route is for Identities component 
          with exact path "/", in component props 
          we passes the imported component*/}
          {/* <Route path="/" element={<Home />} /> */}
          <Route index element={<Identities />} />
          <Route path='*' element={<Identities />} />
          <Route path="/Identities" element={<Identities />} />
          <Route path='/Groups' element={<Groups/>} exact/>
          <Route path='/OffchainGroups' element={<OffchainGroups/>} />
          <Route path='/SendFeedback' element={<SendFeedback/>} exact/>
          <Route path='/Messages' element={<Messages/>} />
          <Route path='/AllGroups' element={<AllGroups/>} />
          <Route path='/CreateGroup' element={<CreateGroup/>} />
          <Route path='/UpdateGroupName' element={<UpdateGroupName/>} />
          <Route path='/UpdateEditor' element={<UpdateEditor/>} />
          <Route path='/UpdateVerifierContract' element={<UpdateVerifierContract/>} />
          <Route path='/CreateIdentity' element={<CreateIdentity/>} />
          <Route path='/AddMember' element={<AddMember/>} />
          <Route path='/SendMessage' element={<SendMessage/>} />
          {/* <Route path='/AddUser' element={<AddUser/>} /> */}

          {/* If any route mismatches the upper 
          route endpoints then, redirect triggers 
          and redirects app to home component with to="/" */}
          {/* <Redirect to="/" /> */}
          <Route path="/" element={<Navigate replace to="/home" />} />
      </Routes>
    </>
    </Router>
  );
}
  
export default App;