import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SingleGig = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();  // Correct way to use useParams
  const [job, setJob] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [tunehibanaya, settunehibanaya] = useState(false);
  const [uid, setUid] = useState('');

  const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));


  useEffect(() => {
    const fetchGig = async () => {
      try {
        const gigRes = await axios.get(`${API_URL}/jobs/${id}`);
        setJob(gigRes.data);        
        const userRes = await axios.get(`${API_URL}/jobs/name/${id}`, { withCredentials: true });
        setUsername(userRes.data);
        const idRes = await axios.get(`${API_URL}/jobs/${id}`);
        setUid(idRes.userId);

        if(currentUser._id === gigRes.data.userId) {
          settunehibanaya(true);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);





  const handleChat = async (job) => {
    const currentUser  = JSON.parse(localStorage.getItem("currentUser-LS"));
    // Log the order details to debug
    console.log("job detaiks :", job); 


    // refer this :  const newChat = new Chat({
    //   chatId: req.isFreelancer ? req.userId + req.body.to : req.body.to + req.userId,
    //   freelancerId: req.isFreelancer ? req.userId : req.body.to,
    //   buyerId: req.isFreelancer ? req.body.to : req.userId,
    // });

    //cid : iski Freelancerid + buyerID;

    
    const freelancerId = job.userId;
    const buyerId = currentUser._id; 
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
        } catch (creationErr) {
            console.error("Error while creating a new chat:", creationErr);
        }
    }
};



  const handleCreation = async (jobId) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
    console.log(currentUser);
    const freelancerId = job.userId; // Assuming the userId is from job object
    const buyerId = currentUser._id;

    try {
      console.log("Creating order with jobId:", jobId);
      console.log("FreelancerId:", freelancerId);
      console.log("BuyerId:", buyerId);
      console.log("Price:", job.price);

      await axios.post(`${API_URL}/order/${jobId}`, { 
        jobId: id,
        freelancerId: freelancerId,
        buyerId: buyerId,
        price: job.price,
      }, { withCredentials: true });

      console.log("Order created successfully, navigating to orders page");
      navigate('/orders');
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

if (loading) {
  return <div>Loading...</div>;
}

if (!job) {
  return <div>Job not found</div>;
}


  return (
    <div className="bg-black min-h-screen text-white flex justify-center items-center ">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <img
            src={job.cover || "/studio.webp"}
            style={{ borderRadius: '10px', maxHeight: '200px', objectFit: 'cover' }}
            alt="image not available"
          />
          <CardTitle className="text-slate-100 text-lg mt-2">{job.short_title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-green-200 text-sm'>{job.short_description}</p>
          <hr className='w-60' />

          <p className='text-slate-200 text-sm mt-1'>{job.long_description}</p>
        </CardContent>
        <CardFooter>
          <p className='text-slate-400 text-sm'>Priced at ₹{job.price}</p>
        </CardFooter>
        <CardFooter>
          <p className='text-slate-400 text-sm'>Posted by: {username}</p>
        </CardFooter>
  
        {tunehibanaya ? (
          <CardFooter>
            <p className='text-1xl text-white'>You created this job</p>
          </CardFooter>
        ) : (
          <>
            <CardFooter className="flex-row gap-2">
              <Button onClick={() => handleChat(job)}>Chat</Button>
            </CardFooter>
            <CardFooter className="flex-row gap-2">
              <Button onClick={() => handleCreation(job._id)}>Create Order</Button>
            </CardFooter>
          </>
        )}

      </Card>
    </div>
  );
};

export default SingleGig;
