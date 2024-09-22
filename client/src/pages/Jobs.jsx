import React, { useEffect, useState } from "react";
import Jobcard from "../components/Jobcard";
import axios from "axios";

function Jobs() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));


  const professions = [
    "Songwriter",
    "Session Musician",
    "Bassist",
    "Guitarist",
    "Drummer",
    "Producer",
    "Vocalist",
    "Audio Engineer",
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/jobs/`);
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

  const filterJobs = (jobs, profession) => {
    if (profession) {
      const filtered = jobs.filter(job => job.profession === profession);
      setFilteredData(filtered);
    } else {
      setFilteredData(jobs);
    }
  };

  useEffect(() => {
    filterJobs(data, selectedProfession);
  }, [selectedProfession, data]);

  const handleProfessionChange = (e) => {
    setSelectedProfession(e.target.value);
  };


  return (
    <div className="bg-black min-h-screen text-white">
      <header className="bg-black p-4 md:p-6">
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-white">All Active Jobs</h1>
          <div className="my-4">
            <select
              className="p-2 bg-gray-800 text-white rounded"
              value={selectedProfession}
              onChange={handleProfessionChange}
            >
              <option value="">All Professions</option>
              {professions.map(profession => (
                <option className='text-white' key={profession} value={profession}>
                  {profession}
                </option>
              ))}
            </select>
          </div>

        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? <p className="text-center text-gray-400">Loading...</p>
            : error
            ? <p className="text-center text-red-500">Something went wrong!</p>
            : filteredData.length === 0 
            ? <p className="text-center text-gray-400">No jobs found.</p>

       
            : filteredData.map((job) => (
              <Jobcard
                key={job._id}
                item={job}
                isCreatedByCurrentUser={job.userId === currentUser?._id}
              />
            ))}
        </div>
      </main>
    </div>
  );
}

export default Jobs;
