import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";


const Chat = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/api/messages/${id}`, {withCredentials : true});
        setMessages(res.data);
      } catch (err) {
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      chatId: id,
      userId : currentUser._id,
      baat: e.target[0].value,
    };
    try {
      await axios.post(`http://localhost:8001/api/messages/${id}`, message, {withCredentials : true});
      setMessages((prev) => [...prev, message]);
      e.target[0].value = "";
    } catch (err) {
      console.error("Failed to send message.");
    }
  };

  return (
    <div className="message bg-black  text-white p-4 mt-5 box-border">
      <div className="container mx-auto scroll-m-2">
       
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="messages space-y-4 text-yellow-200">
            {messages.map((m) => (
              <div className={`flex items-start space-x-4 ${m.userId === currentUser._id ? "justify-end" : ""}`} key={m._id}>
              
                <p className={`bg-gray-800 p-2 rounded ${m.userId === currentUser._id ? "bg-blue-600 text-white" : "bg-gray-600 text-white"}`}>{m.baat}</p>
              </div>
            ))}
          </div>
        )}
        <hr className="my-4 border-gray-700" />
        <form className="write flex space-x-2" onSubmit={handleSubmit}>
          <textarea className="w-full p-2 bg-gray-800 rounded text-white" placeholder="Write a message" />
          <button type="submit" className="hover:bg-gray-500 bg-blue-700 text-white py-2 px-4 rounded">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
