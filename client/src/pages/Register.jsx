import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [dp, setDp] = useState('');
  const [url, setUrl] = useState('');
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    isFreelancer: false,
    headline: ""
  });

  const navigate = useNavigate();

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
      const response = await axios.post(`${API_URL}/auth/register`, {
        ...user,
        dp: profilePictureUrl // Use the updated URL
      }, {
        withCredentials: true // Include credentials with request
      });

      if (response.status === 200 || response.status === 201) {
        // Registration successful
        console.log("Registration successful!");
        navigate("/"); // Redirect to homepage (or desired location)
      } else {
        // Handle registration errors
        console.error("Registration failed:", response.data);
      }
    } catch (error) {
      console.error("Error while registering frontend:", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your input fields here */}
      <input
        type="text"
        name="username"
        value={user.username}
        onChange={handleInputChange}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleInputChange}
        placeholder="Password"
      />
      <input
        type="text"
        name="headline"
        value={user.headline}
        onChange={handleInputChange}
        placeholder="Headline"
      />
      <input
        type="checkbox"
        name="isFreelancer"
        checked={user.isFreelancer}
        onChange={(e) => setUser({ ...user, isFreelancer: e.target.checked })}
      />
      <label>Freelancer</label>
      <input
        type="file"
        onChange={(e) => setDp(e.target.files[0])}
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
