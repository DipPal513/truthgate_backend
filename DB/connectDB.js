import mongoose from 'mongoose';
import dotenv from 'dotenv';

 
dotenv.config();


 const connectDB = async () => {
    try {
       await mongoose.connect(process.env.DB_URI).then(() => {
            console.log("connection success to DB..!!")
        });
    } catch (error) {
        console.log(`connection failed error : ${error}`);
    }
}
export default connectDB;