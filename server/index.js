import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import jobRoute from './routes/job.route.js';
import messagesRoute from './routes/messages.route.js';
import orderRoute from './routes/order.route.js';
import payRoute from './routes/pay.route.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

const app = express();

// Determine environment and load appropriate .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Log to check if environment variable is loaded
console.log("Environment:", process.env.NODE_ENV);
console.log("Mongo URI:", process.env.MONGO);
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the process with failure
});

// Use the routes
app.use("/api/user", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/auth", authRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/order", orderRoute);
app.use("/api/pay", payRoute);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
