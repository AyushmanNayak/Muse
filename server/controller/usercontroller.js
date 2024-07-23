import User from '../models/user.model.js'
import jwt from "jsonwebtoken";

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }

        // Verify the token asynchronously
        const payload = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        // Check if the decoded token ID matches the user ID
        if (payload.id !== user._id.toString()) {
            return res.status(403).send("Forbidden: You can only delete your own account");
        }

        // Delete the user
        await User.findByIdAndDelete(req.params.id);
        
        res.status(200).send("User deleted successfully");
    } catch (err) {
        console.error("Error in delete operation:", err);
        res.status(500).send("Internal Server Error");
    }


};

export const getSingleUser = async(req, res) => {
    try {
        const userObject = await User.findById(req.params.id);
        if(userObject) return res.send(userObject);
        return res.send("nahi mila")

    } catch (error) {
        res.send("lol, Kim wont leave West alone");
    }
};
