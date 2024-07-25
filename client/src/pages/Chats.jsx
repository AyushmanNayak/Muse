import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';


const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"))

  //gettin alllll chats foa
  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await axios.get('http://localhost:8001/api/chats', {
          withCredentials: true,
        });
        setChats(res.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch chats.');
        setLoading(false);
      }
    };
    getChats();
  }, []); // Empty d array to run once after initial render

  //getUsername of the nigga 
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="messages">
      {loading ? (
        "Loading..."
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-white">
                  {currentUser.isFreelancer ? "Buyer" : "Freelancer"}
                </th>
                <th className="p-3 text-white">Last Message</th>
                <th className="p-3 text-white">Date</th>
               
              </tr>
            </thead>
            <tbody>
              {chats.map((msg) => (
                <tr
                  className={`hover:bg-gray-700 ${
                    ((currentUser.isFreelancer ) ||
                      (!currentUser.isFreelancer)) &&
                    "active"
                  }`}
                  key={msg._id}
                >
                  <td className="p-3 text-slate-50 text-center hover:bg-gray-600">
                  <Link to={`/chats/${msg.chatId}`} className="link  hover:bg-gray-600">
                    {currentUser.isFreelancer ? msg.buyerId : msg.freelancerId}
                    </Link>
                  </td>
                  <td className="p-3 text-slate-50 text-center  hover:bg-gray-600">
                    <Link to={`/chats/${msg.chatId}`} className="link  hover:bg-gray-600">
                      {msg.lastMessage?.substring(0, 100)}...
                    </Link>
                  </td>

                  <td className="p-3 text-slate-50 text-center  hover:bg-gray-600">
                    {moment(msg.updatedAt).fromNow()}
                  </td>
                 
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Chats;