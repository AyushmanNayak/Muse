import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Controller
export const register = async (req, res) => {
    try {
        // Hash the password
        const hash = await bcrypt.hash(req.body.password, 10);
        // Create a new user
        const newUser = new User({
            ...req.body, // Spread the request body to include all other fields
            password: hash, // Override the password field with the hashed password
        });
        
        await newUser.save();
        res.status(200).send("User created successfully");
    } catch (err) {
        console.error("Error in user registration:", err);
        res.status(500).send("Registration error");
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        // Find the user in the database
        const user = await User.findOne({ username: req.body.username });

        // If no user found, return 404
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        // If passwords don't match, return 401
        if (!passwordMatch) {
            return res.status(401).send("Incorrect password.");
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, isFreelancer: user.isFreelancer },
            process.env.SECRET,
            { expiresIn: '5d' }
        );
        console.log("Generated Token Payload:", { id: user._id, isFreelancer: user.isFreelancer });

        // Respond with token in a cookie and user data (without password)
        const { password, ...userData } = user.toObject(); // Use toObject to get a plain JS object
        res.cookie("accessToken", token, {
            httpOnly: true,
            sameSite: 'None', // Set to "None" for cross-site cookies
            // secure: process.env.NODE_ENV === 'production', // true in production
            secure : true

        }).status(200).json(userData);

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Internal server error.");
    }
};

// Logout Controller
export const logout = async (req, res) => {
    // Clear the cookie that stores the JWT token
    res.clearCookie("accessToken", {
        sameSite: 'None', // Set to "None" for cross-site cookies
        secure: process.env.NODE_ENV === 'production', // true in production
    }).status(200).send("User logged out");
};
