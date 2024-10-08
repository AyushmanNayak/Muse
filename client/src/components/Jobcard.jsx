import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useEffect } from "react";

const  Jobcard = ({item, isCreatedByCurrentUser}) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState('');
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await axios.get(`${API_URL}/jobs/name/${item._id}`, { withCredentials: true });
        setUsername(res.data);
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername('Unknown user');
      }
    };

    fetchUsername();
  }, [item._id]);


  return (
    <Link to={`/job/${item._id}`} className="link">

    <Card className="hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 cursor-pointer w-fit h-fit"  > 
  <CardHeader>
  <img
          src={item.cover}
          onError={(e) => e.target.src = "/studio.webp"}
          style={{ borderRadius: '10px' }}
          alt="image not available"
        />
    <CardTitle className = "text-slate-100">{item.short_title}</CardTitle>
   
  </CardHeader>
  <CardContent>
  <p className="text-slate-200">{item.short_description}</p>
        {isCreatedByCurrentUser && (
          <p className="text-green-500 font-bold">You created this job</p>
        )}
  </CardContent>
  <CardFooter>
    <p className='text-slate-400'>starts at ₹{item.price}</p>
  </CardFooter>

  <CardFooter>
    <p className='text-slate-400'> {username}</p>
  </CardFooter>

</Card>
          </Link>
  )
}

export default Jobcard
