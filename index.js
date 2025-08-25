import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'

dotenv.config();

const app=express();
app.use(cors());
connectDB();

const PORT=process.env.PORT||3000
app.use('/',authRoutes)

app.listen(PORT,()=>{
    console.log("server started at",PORT)
})