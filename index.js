import express from 'express';
import connectDB from './DB/connectDB.js';
import dotenv from 'dotenv';
import postRouter from './routes/postRoute.js';
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

(async () => {
    try {
        await connectDB();

        app.use(express.json({ limit: "30mb" }));
        app.use(cookieParser());
        app.use(express.urlencoded({ extended: true }));
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        })

        // Adjust CORS settings based on your production requirements
        app.use(cors({ origin: "https://truthgate.vercel.app", credentials: true }));

        // Routes (Ensure your routes don't need the /api/v1 prefix again)
        app.use("/api/v1", postRouter);
        app.use("/api/v1", userRouter);

        app.listen(port, () => {
            console.log(`App is running on port ${port}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        // Handle initialization errors gracefully
    }
})();
