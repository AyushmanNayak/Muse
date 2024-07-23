import React, { useState } from 'react'
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);


export function Login () {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const res = await axios.post("http://localhost:8001/api/auth/login", 
        {username, password}, {
          withCredentials : true
        }
      );
      localStorage.setItem("currentUser-LS", JSON.stringify(res.data));
      console.log(res.data)
      navigate('/');
      
    } catch (error) {
      setError(error.response.data);
   //   alert(error.response.data)
      console.log(error)
    }
  
  };

  return (


    <div className="max-w-md w-full mx-auto rounded-md p-4 md:p-8 shadow-input bg-black mt-2 h-full">
      <h2 className="font-bold text-xl text-neutral-200">
        Welcome back to MUSE
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex items-center mb-8">
         
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="metalizer" type="text" onChange = {e=> setUsername(e.target.value)} />
 
        </LabelInputContainer>
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="text" 
          onChange = {e=> setPassword(e.target.value)}/>
        </LabelInputContainer>

        

        

        <button
          className="bg-gradient-to-br from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium shadow-inner mt-2"
          type="submit"
        >
          Login
        </button>

        {error && error}
      </form>
    </div>
  );
}



