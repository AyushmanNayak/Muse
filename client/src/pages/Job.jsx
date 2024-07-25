import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SingleGig = () => {
  const { id } = useParams();  // Correct way to use useParams
  const [gig, setGig] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const gigRes = await axios.get(`http://localhost:8001/api/jobs/${id}`);
        setGig(gigRes.data);
        
        const userRes = await axios.get(`http://localhost:8001/api/jobs/name/${id}`, { withCredentials: true });
        setUsername(userRes.data);
      } catch (error) {
        console.error('Error fetching gig:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const handleChat = async() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
    const freelancerId = gig.userId; // Assuming the userId is from gig object
    const buyerId = currentUser._id;
    const cid = freelancerId+buyerId;

    try {
      const res = await axios.get(`http://localhost:8001/api/chats/${cid}`, { withCredentials: true });

    if (res.data) {
        navigate(`/chats/${res.data.chatId}`);
      } else {
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
    const currentUser = JSON.parse(localStorage.getItem("currentUser-LS")) ;
    try {
      const userRes = await axios.get(`http://localhost:8001/api/jobs/name/${id}`, { withCredentials: true });


      await axios.post(`http://localhost:8001/api/order/${jobId}`, { 
        jobId: id,
        
        freelancerId : 
        buyerId: currentUser._id,
        price: gig.price,
        // Add more details as needed
      }, { withCredentials: true });

      // Optionally, you can navigate to an order confirmation page or show a success message
      navigate('/orders');
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!gig) {
    return <div>Gig not found</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white flex justify-center items-center ">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <img
            src={gig.cover || "/studio.webp"}
            style={{ borderRadius: '10px', maxHeight: '200px', objectFit: 'cover' }}
            alt="image not available"
          />
          <CardTitle className="text-slate-100 text-lg mt-2">{gig.short_title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-green-200 text-sm'>{gig.short_description}</p>
          <hr className='w-60' />

          <p className='text-slate-200 text-sm mt-1'>{gig.long_description}</p>
        </CardContent>
        <CardFooter>
          <p className='text-slate-400 text-sm'>Starts at ₹{gig.price}</p>
        </CardFooter>
        <CardFooter>
          <p className='text-slate-400 text-sm'>Posted by: {username}</p>
        </CardFooter>

        <CardFooter className="flex-row gap-2">
          <Button onClick={handleChat}>Chat</Button>
        </CardFooter>

        <CardFooter className="flex-row gap-2">
          <Button onlick={handleCreation}>Create Order</Button>
        </CardFooter>

      </Card>
    </div>
  );
};

export default SingleGig;
