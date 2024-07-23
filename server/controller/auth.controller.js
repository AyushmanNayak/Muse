import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {

        //freaking hash the passwords
        const hash = await bcrypt.hash(req.body.password, 10);
        // Create a new user
        const newUser = new User({
            ...req.body, //baaaki sab as it is
            password: hash //bass password ye wala lo, pichle wala overwrite kardo 

        });
        
        await newUser.save();
        res.status(200).send("User created successfully");
    } catch (err) {
        console.error("Error in user registration:", err);
        res.status(500).send("Registration error");
    }
};

export const login = async (req, res) => {
    try {
        // Find the user in the database
        const user = await User.findOne({ username: req.body.username });

        // If no user found, return 404 or handle as per your application logic
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        // If passwords don't match, return 401 or handle as per your application logic
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
            sameSite: "none", // Set to "None" for cross-site cookies
            secure: true // Ensure cookie is sent only over HTTPS
        }).status(200).json(userData);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Internal server error.");
    }
};
export const logout = async (req, res) => {
    // cler the cookiee that stores the JWT taoken
    //so that the token gets invalidates

    //None: Cookies are sent with both first-party and cross-site requests. However, when setting sameSite: 'None', the secure attribute must also be set to true to ensure the cookie is only sent over HTTPS.
    
    res.clearCookie("accessToken", {
        sameSite : "none",
        secure : true 
    }).status(200).send("User loggedout")

};
