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
  const navigate = useNavigate();
  const { id } = useParams();  // Correct way to use useParams
  const [job, setGig] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [tunehibanaya, settunehibanaya] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));


  useEffect(() => {
    const fetchGig = async () => {
      try {
        const gigRes = await axios.get(`http://localhost:8001/api/jobs/${id}`);
        setGig(gigRes.data);        
        const userRes = await axios.get(`http://localhost:8001/api/jobs/name/${id}`, { withCredentials: true });
        setUsername(userRes.data);
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

  const handleChat = async() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
    const freelancerId = job.userId; // Assuming the userId is from job object
    const buyerId = currentUser._id;
    const cid = freelancerId+buyerId;
    console.log("freelancerId", freelancerId);

    try {
      const res = await axios.get(`http://localhost:8001/api/chats/${cid}`, { withCredentials: true });

    if (res.data) {
        navigate(`/chats/${res.data.chatId}`);
      } else {
        console.log("here")
        const createRes = await axios.post(`http://localhost:8001/api/chats/`, {
          to: freelancerId
        }, { withCredentials: true });
        navigate(`/chats/${createRes.data.chatId}`);
      }
    } catch (error) {
      console.error("Error while accessing/creating chat:", error);
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

      await axios.post(`http://localhost:8001/api/order/${jobId}`, { 
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
              <Button onClick={handleChat}>Chat</Button>
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
