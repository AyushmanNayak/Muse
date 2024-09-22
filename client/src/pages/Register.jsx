"use client";
import React, { useState } from "react";
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

export function Register() {
  const navigate = useNavigate();
 const API_URL = import.meta.env.VITE_API_URL;
  const [dp, setDp] = useState('');
  const [url, setUrl] = useState('');
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    isFreelancer: false,
    profession: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profilePictureUrl = url;

    if (dp) {
      try {
        profilePictureUrl = await upload(dp);
        console.log("Uploaded profile picture URL:", profilePictureUrl);
        setUrl(profilePictureUrl); // Update the state with the URL
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        return; // Exit if the upload fails
      }
    }

    try {
      await axios.post(
        `${API_URL}/auth/register`, 
        { ...user, dp: profilePictureUrl },
        { withCredentials: true },
      );
      navigate("/");
    } catch (error) {
      console.error("Error while registering frontend:", error);
    }
  };

  const freeCheck = (e) => {
    setUser((prev) => {
      return { ...prev, isFreelancer: e.target.checked };
    });
  };

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

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
          <Input id="dp" type="file" onChange={(e) => setDp(e.target.files[0])} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label>Freelancer? Type in your profession</Label>
          <Input id="profession" placeholder="Mixing Engineer" type="text" onChange={handleChange} />
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
