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
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [tunehibanaya, settunehibanaya] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const gigRes = await axios.get(`${API_URL}/jobs/${id}`);
        setJob(gigRes.data);
        const userRes = await axios.get(`${API_URL}/jobs/name/${id}`, { withCredentials: true });
        setUsername(userRes.data);
        if (currentUser && currentUser._id === gigRes.data.userId) {
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
    const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
    const freelancerId = job.userId;
    const buyerId = currentUser._id;
    const cid = freelancerId + buyerId;

    try {
      const res = await axios.get(`${API_URL}/chats/${cid}`, { withCredentials: true });
      if (res.data) {
        navigate(`/chats/${res.data.chatId}`);
      } else {
        throw new Error('Chat not found, will create a new one');
      }
    } catch (err) {
      try {
        const res = await axios.post(`${API_URL}/chats/`, {
          to: currentUser.isFreelancer ? buyerId : freelancerId
        }, { withCredentials: true });
        navigate(`/chats/${res.data.chatId}`);
      } catch (creationErr) {
        console.error("Error while creating a new chat:", creationErr);
      }
    }
  };

  const handleCreation = async (jobId) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
    if (!currentUser) navigate('/login');
    const freelancerId = job.userId;
    const buyerId = currentUser._id;

    try {
      await axios.post(`${API_URL}/order/${id}`, {
        jobId: id,
        freelancerId: freelancerId,
        buyerId: buyerId,
        price: job.price,
      }, { withCredentials: true });
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
    <div className="bg-black min-h-screen text-white flex justify-center items-center">
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
        <CardFooter>
          {!currentUser ? (
            <p className="text-red-500">Please log in to chat or create an order.</p>
          ) : !currentUser.isFreelancer ? (
            tunehibanaya ? (
              <p className="text-1xl text-white">You created this job</p>
            ) : (
              <div className="flex-row gap-2">
                <Button onClick={(e) => { e.stopPropagation(); handleChat(job); }}>Chat</Button>
                <Button onClick={(e) => { e.stopPropagation(); handleCreation(job._id); }}>Create Order</Button>
              </div>
            )
          ) : (
            <>
            <Button onClick={(e) => { e.stopPropagation(); handleCreation(job._id); }}>Create Order</Button>
            <Button onClick={(e) => { e.stopPropagation(); handleChat(job); }}>Chat</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SingleGig;
