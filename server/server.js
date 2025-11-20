import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

//----- here I am implemeting the cookie method 
import cookieParser from 'cookie-parser';
//----

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import componentRoutes from './routes/componentRoutes.js';
import issueRoutes from './routes/issueRoutes.js';

dotenv.config();
console.log("SMTP:", process.env.SMTP_EMAIL, process.env.SMTP_PASS);


const app=express();


///---

///----

// app.use(cors());


app.use(cors({
  origin: "http://localhost:5173", // The EXACT URL of your React Frontend
  credentials: true ,// This allows the browser to send cookies
   methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(cookieParser());
app.use(express.json());



//routes

app.use("/api/auth",authRoutes);
app.use("/api/users", userRoutes); 
app.use("/api/components",componentRoutes);
app.use("/api/issue",issueRoutes);


//database connection

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));


const PORT= process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));







