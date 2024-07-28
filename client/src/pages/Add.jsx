import React, { useState } from 'react'
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { cn } from "@/lib/utils";
import upload from "@/upload";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);



const Add = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [cover, setCover] = useState('');
  const [url, setUrl] = useState('');
  const [job, setJob] = useState({
    userId: "",
    price: "",
    short_title: "",
    short_description: "",
    long_description: "",
  })


  const handleChange = (e) => {
    setJob({
      ...job, [e.target.id]: e.target.value,
    });
  }

  const handleFileChange = (e) => {
    setCover(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser-LS"));

    e.preventDefault();
   
      const url = await upload(cover);
      console.log("Uploaded cover image:", url);

    try {
      await axios.post(`${API_URL}/jobs/`, {
        ...job,
        cover: url,
        userId: currentUser._id
      }, {
        withCredentials: true
      });
      navigate("/jobs");
    }
    catch (error) {
      console.error("error creating job frinetnd")
    }
  }


  return (
    <div className="max-w-md w-full mx-auto rounded-md p-4 md:p-8 shadow-input bg-black mt-2">
      <h2 className="font-bold text-xl text-neutral-200">
        Post a new job. It is simple.
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>

      <LabelInputContainer className="mb-4 text-white">
          <Label htmlFor="short_title">Title</Label>
          <Input
            id="short_title"
            placeholder="Adele style songwriting"
            type="text"
            onChange={handleChange}
            
          />
        </LabelInputContainer>


       <LabelInputContainer className="mb-4 text-white">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            placeholder=""
            type="text"
            onChange={handleChange}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="cover">Cover Picture</Label>
          <Input id="cover" type="file" onChange={(e) => setCover(e.target.files[0])} />
        </LabelInputContainer>



        <LabelInputContainer className="mb-4 text-white">
          <Label htmlFor="short_description">Describe the job in brief (Required)</Label>
          <Input
            id="short_description"
           
            type="text"
            onChange={handleChange}
           
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4 text-white">
          <Label htmlFor="short_description">Detailed description of the job</Label>
          <Input
            id="short_description"
          
            type="text"
            onChange={handleChange}
           
          />
        </LabelInputContainer>


        





        <button
          className="bg-gradient-to-br from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium shadow-inner mt-2"
          type="submit"
        >
          Post
        </button>


      </form>
    </div>
  )
}

export default Add
