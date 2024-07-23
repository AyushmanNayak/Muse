import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token, may have expired' });
        }

        req.userId = payload.id;
        req.isFreelancer = payload.isFreelancer;
        // console.log("verifyToken payload:", payload);  // Debugging line
        next(); // Pass control to the next middleware or route handler
    });
};