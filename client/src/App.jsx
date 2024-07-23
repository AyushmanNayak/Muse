import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Job from "./pages/Job";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register.jsx";
import Add from "./pages/Add";
import Orders from "./pages/Orders";
import Messages from "./pages/Messages";
import Message from "./pages/Message";
import MyJobs from "./pages/MyJobs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{
            background: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
            border: "1px solid #f5c6cb",
            padding: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            fontSize: "14px"
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/myJobs" element={<MyJobs />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/message/:id" element={<Message />} />
          <Route path="/add" element={<Add />} />
          <Route path="/gig/:id" element={<Job />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
       
      </div>
    </Router>
  );
};

export default App;
