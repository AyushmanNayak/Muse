import React, { useEffect, useState } from "react";
import Jobcard from "../components/Jobcard";
import axios from "axios";

function Jobs() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8001/api/jobs/");
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  return (
    <div className="bg-black min-h-screen text-white">
      <header className="bg-black p-4 md:p-6">
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-white">All Active Jobs</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? <p className="text-center text-gray-400">Loading...</p>
            : error
            ? <p className="text-center text-red-500">Something went wrong!</p>
            : data.length === 0
            ? <p className="text-center text-gray-400">No jobs found.</p>
            : data.map((job) => <Jobcard key={job._id} item={job} />)}
        </div>
      </main>
    </div>
  );
}

export default Jobs;
