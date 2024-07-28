import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";

import axios from "axios";



const Navbar = () => {
 
 const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
 const API_URL = import.meta.env.VITE_API_URL;
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', isActive);
    // clg(currentUser.dp);
    return () => {
      window.removeEventListener('scroll', isActive);
    };
  }, []);

  

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {
        withCredentials : true 
      }
      );
      localStorage.setItem('currentUser-LS', null);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className={active || pathname !== '/' ? 'navbar active' : 'navbar'}>
      <div className=" container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold w-20 bg-black">
          <img src="/muse.png" alt="Logo" />
        </Link>
        <div className="space-x-4 flex items-center bg-black">
          <Link to="/jobs" className="text-white hover:text-zinc-400">
            Explore
          </Link>

          {!currentUser ? (
            <>
              <Link to="/login" className="link">
                <Button color="primary" className="bg-gray-500 hover:bg-gray-700 text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="link">
                <Button color="primary" className="bg-gray-500 hover:bg-gray-700 text-white">
                  Join
                </Button>
              </Link>
            </>
          ) : (
            <div className="relative bg-white">
              <div className="user flex items-center cursor-pointer" onClick={() => setOpen(!open)}>
                <img src= {currentUser.dp? currentUser.dp : "/blank.webp"} alt="User Avatar" className="w-10 h-10 rounded-full ml-10" />
                <span className="ml-2 text-white">{currentUser.username}</span>
              </div>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                  {currentUser.isFreelancer && (
                    <>
                      <Link className="block px-4 py-2 bg-white text-gray-800 hover:bg-gray-200" to="/myJobs">
                        My Posts
                      </Link>
                      <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-200 bg-white" to="/add">
                        Post a job
                      </Link>
                    </>
                  )}
                  <Link className="block px-4 py-2 text-gray-800  hover:bg-gray-200 bg-white" to="/orders">
                    Orders
                  </Link>
                  <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-200 bg-white" to="/chats">
                    Messages
                  </Link>
                  <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
