import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';

dotenv.config();

const app=express();
connectDB();

const PORT=process.env.PORT||3000

app.listen(PORT,()=>{
    console.log("server started at",PORT)
})