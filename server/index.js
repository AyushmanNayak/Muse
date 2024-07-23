import express from 'express';
import cors from "cors"
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import jobRoute from './routes/job.route.js';
import messagesRoute from './routes/messages.route.js';
import orderRoute from './routes/order.route.js';
import authRoute from './routes/auth.route.js'
import cookieParser from 'cookie-parser'

const app = express();

dotenv.config();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));



app.use(cookieParser());


// Connect to MongoDB
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});

// Use the routes
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute);
app.use("/api/job", jobRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/order", orderRoute);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
