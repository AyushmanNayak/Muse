import React, { useEffect, useState } from 'react'
import UserJobcard from '@/components/userJobCard';

import axios from "axios"
const MyJobs = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [my, setMy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false); //for refrsh upon deletion


  useEffect( () => {
    const mymymy = async () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));
      const uid = currentUser._id;
      setIsLoading(true);
    setError(null);
      try {
        const res = await axios.get(`${API_URL}/jobs/my/${uid}`, {
          withCredentials  : true
        });
        setMy(res.data);
        console.log(my);
        
      } catch (error) {
        setError(error);

      }

      finally{
        setIsLoading(false);
      }
    }
    mymymy();
  }, [refresh]);   //for gettin my jobs

  const handleDelete = async (jobId) => {
    try {
        await axios.delete(`${API_URL}/jobs/${jobId}`, {
            withCredentials: true,
        });
        setRefresh((prev) => !prev);
    } catch (error) {
        console.error('Error deleting job:', error);
    }
};


  return (
    <div className="bg-black min-h-screen text-white">
      <header className="bg-black p-4 md:p-6">
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-white">My Jobs</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? <p className="text-center text-gray-400">Loading...</p>
            : error
            ? <p className="text-center text-red-500">Something went wrong!</p>
            : my.length === 0
            ? <p className="text-center text-gray-400">No jobs found.</p>
            : my.map((job) => <UserJobcard key={job._id} item={job} onDelete = {handleDelete }/>)}
        </div>
      </main>
    </div>
  )
}

export default MyJobs
