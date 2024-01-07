import express from 'express';
import connectDB from './DB/connectDB.js';
import dotenv from 'dotenv';
import postRouter from './routes/postRoute.js'
import userRouter from './routes/userRoute.js'
import cookieParser from 'cookie-parser';
// config dotenv
dotenv.config();
const app = express();
// port
const port = process.env.PORT || 3000;
// main server
(async () => {
    // connecting database
    await connectDB();
    // middlewares
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({extended:true}));
    // routes
    app.use("/api/v1", postRouter)
    app.use("/api/v1", userRouter)



    //port listener
    app.listen(port, () => {
        console.log(`app is running on port ${port}`)
    })

})();