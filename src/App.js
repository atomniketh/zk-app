import "./App.css";
import "./w3.css";

// import './zkApp.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import AllGroups from "./components/AllGroups";
import CreateGroup from "./components/CreateGroup";
import UpdateGroupName from "./components/UpdateGroupName";
import UpdateEditor from "./components/UpdateEditor";
import UpdateVerifierContract from "./components/UpdateVerifierContract";
import CreateIdentity from "./components/CreateIdentity";
import AddMember from "./components/AddMember";
import SendMessage from "./components/SendMessage";
import MessageDev from "./components/MessageDev";
import SendFile from "./components/SendFile";
import MessageAdmin from "./components/MessageAdmin";
import Administration from "./components/Administration";
import GroupMessages from "./components/GroupMessages";
import GroupList from "./components/GroupList";


function App() {
 
  return (
    <Router>
      <>
        {/* This is the alias of BrowserRouter i.e. Router */}
        <Routes>
          {/* This route is for Identities component 
          with exact path "/", in component props 
          we passes the imported component */}
          {/* <Route path="/" element={<Home />} /> */}
          <Route index element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="/About" element={<About />} />
          {/* <Route path="/Messages" element={<Messages />} /> */}
          <Route path="/AllGroups" element={<AllGroups />} />
          <Route path="/CreateGroup" element={<CreateGroup />} />
          <Route path="/UpdateGroupName" element={<UpdateGroupName />} />
          <Route path="/UpdateEditor" element={<UpdateEditor />} />
          <Route
            path="/UpdateVerifierContract"
            element={<UpdateVerifierContract />}
          />
          <Route path="/CreateIdentity" element={<CreateIdentity />} />
          <Route path="/AddMember" element={<AddMember />} />
          <Route path="/SendMessage" element={<SendMessage />} />
          <Route path="/SendFile" element={<SendFile />} />
          <Route path="/MessageAdmin" element={<MessageAdmin />} />
          <Route path="/MessageDev" element={<MessageDev />} />
          <Route path="/Administration" element={<Administration />} />
          <Route path="/GroupMessages" element={<GroupMessages />} />
          <Route path="/GroupList" element={<GroupList />} />
          
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
