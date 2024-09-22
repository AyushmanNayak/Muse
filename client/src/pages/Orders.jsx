import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import axios from "axios";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
        console.log("currentUser");
        console.log(currentUser); 
        const id = currentUser._id;
       // console.log(API_URL);
        const res = await axios.get(`${API_URL}/order/`, {
          withCredentials : true 
        });
        setOrders(res.data);
        console.log(res.data);

      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleContact = async (order) => {
    // Log the order details to debug
    console.log("Order details:", order);

    const freelancerId = order.freelancerId;
    const buyerId = order.buyerId;
    const cid = freelancerId + buyerId;

    console.log("freelancerId:", freelancerId);
    console.log("buyerId:", buyerId);
    console.log("Chat ID (cid):", cid);

    try {
        // Try to fetch the chat
        const res = await axios.get(`${API_URL}/chats/${cid}`, {
            withCredentials: true
        });

        // Navigate to the chat if it exists
        if (res.data) {
            navigate(`/chats/${res.data.chatId}`);
        } else {
            throw new Error('Chat not found, will create a new one');
        }
    } catch (err) {
        // If the chat doesn't exist, create a new one
        console.error("Chat not found, creating a new one. Error:", err);

        try {
          const res = await axios.post(`${API_URL}/chats/`, {
            to: currentUser.isFreelancer ? buyerId : freelancerId
          }, { withCredentials: true }); // Ensure cookies or tokens are sent properly
            navigate(`/chats/${res.data.chatId}`);

            navigate(`/chats/${res.data.chatId}`);
        } catch (creationErr) {
            console.error("Error while creating a new chat:", creationErr);
        }
    }
};



  const handlePay = async (order) => {
    const stripe = await loadStripe('pk_test_51Pf7tC2NTLE8AdGGIdsoXYpvBlCcFtMz3UHEgQryyAaEwP6bl0920uwUu0BLpadQVMTmlHjMxc1Ale1y6Cj14edZ008fzN1cq6'); // Publishable key

    try {
      const res = await axios.post(`${API_URL}/pay/create-checkout-session`, {
        products: [order] // Ensure products is an array
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const { id } = res.data;
      const result = await stripe.redirectToCheckout({ sessionId: id });
    //  order.isCompleted = true; --> this couldn't happen immediately after redirection. Rather, this should be handled by webhook :

    //The webhook will notify your server when the payment is successfully processed, and then you can update the order status on the server side.

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };


  return (
    
    <div className="orders bg-black min-h-screen text-white p-4">
      <div className="container mx-auto">
        <div className="title mb-6">
          <h1 className="text-3xl font-bold text-white text-center">Orders</h1>
        </div>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-white ">Title</th>
                <th className="p-3 text-white">Price</th>
                <th className="p-3 text-white">Contact</th>
                <th className="p-3 text-white">Pay</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-700">
                  
                  <td className="p-3 text-slate-50 text-center">{order.short_title}</td>
                  <td className="p-3  text-slate-50 text-center">₹{order.price}</td>
                  <td className="p-3 text-slate-50 text-center">
                  {/* <div className="cursor-pointer color-white"> <LocalPostOfficeIcon style={{color : "white"}}/> </div> */}
                  <Button onClick={() => handleContact(order)}>Chat</Button>
                  </td>
                   <td className="p-3 text-slate-50 text-center">
                    {/* Only show Pay button if current user is a buyer and order isn't completed */}
                    {!order.isCompleted && !currentUser.isFreelancer ? (
                      <Button onClick={() => handlePay(order)}>Pay</Button>
                    ) : (
                      <p>{order.isCompleted ? "Paid" : "Unavailable for freelancers"}</p>
                    )}
                  </td> 
                
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
