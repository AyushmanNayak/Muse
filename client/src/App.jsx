import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

import "./App.css"
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Success from "./pages/Success";
import Failure from "./pages/Failure";
import Job from "./pages/Job";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register.jsx";
import Add from "./pages/Add";
import Orders from "./pages/Orders";
import Chats from "./pages/Chats";
import Chat from "./pages/Chat";
import MyJobs from "./pages/MyJobs";



const App = () => {
  return (
   
    <Router>
      <div className="app">
        
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/myJobs" element={<MyJobs />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chats/:id" element={<Chat />} />
          <Route path="/add" element={<Add />} />
          <Route path="/job/:id" element={<Job />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/login" element={<Login />} />
        </Routes>
       
      </div>
    </Router>
   
  );
};

export default App;
