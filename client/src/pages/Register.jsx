"use client";
import React, { useState } from "react";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { cn } from "@/lib/utils";
import  upload  from "@/upload";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);

export function Register() {
  const navigate  = useNavigate();

  const [dp,setDp] = useState('');
  const [url ,setUrl ]  = useState('');
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    isFreelancer: false,
    headline: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = await upload(dp);
    console.log("Uploaded profile picture URL:", url);

    try {
      await axios.post("http://localhost:8001/api/auth/register", {
        ...user, dp : url, 
        withCredentials  : true
      })
      navigate ("/") 
    } catch (error) {
      
    }
  };

  const freeCheck = (e) => {
    setUser((prev) => {
      return {...prev, isFreelancer : e.target.checked}
    })
  }
  const handleChange = (e) => {
      setUser((prev) => {
        return {...prev, [e.target.id] : e.target.value } ;  //e.target pints to the dom element and since all our imput fields have an id, 
      })
  };


  // console.log(user);  debugging line

  return (
    <div className="max-w-md w-full mx-auto rounded-md p-4 md:p-8 shadow-input bg-black mt-2">
      <h2 className="font-bold text-xl text-neutral-200">
        MUSE says hi!
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex items-center mb-8">
          <input type="checkbox" id="freelancer" className="mr-2" onClick={freeCheck} />
          <Label htmlFor="freelancer" className="text-white">
            Make a freelancer account
          </Label>
        </div>
        <LabelInputContainer className="mb-4 text-white">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Dave Mustaine" type="text" onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="metalizer" type="text" onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="thrashdiaries@gmail.com" type="email" onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" onChange={handleChange} />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="dp">Profile Picture</Label>
          <Input id="dp"  type="file" onChange={(e)=>setDp(e.target.files[0])} />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label>
            Freelancer? type in your profession </Label>
          <Input id="headline" placeholder="Mixing Engineer" type="text" onChange={handleChange} />
        </LabelInputContainer>



        <button
          className="bg-gradient-to-br from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium shadow-inner mt-2"
          type="submit"
        >
          Register
        </button>


      </form>
    </div>
  );
}


