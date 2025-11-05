import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import componentRoutes from './routes/componentRoutes.js';
import issueRoutes from './routes/issueRoutes.js';

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());



//routes

app.use("/api/auth",authRoutes);
app.use("/api/components",componentRoutes);
app.use("/api/issue",issueRoutes);


//database connection

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));


const PORT= process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));







