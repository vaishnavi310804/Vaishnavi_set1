import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser=async(req,res)=>{
    try{
        const{name,email,password}=req.body
    
        if(!name||!email||!password){
            return res.status(400).json({
                message:"all fields are required "
            })
        }
         const isuser= await User.findOne({email})
        if(isuser){
             return res.status(404).json({message:"user already exist"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user = await User.create({
            name,email,password:hashedPassword
        })

        const payload ={
            name:user.name,
            email:user.email,
            id :user._id
        }

        const token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"10h"})
        res.status(201).json({
            token,
            user,
            success:true,
            message:"user registered successfully"
        })
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const loginUser=async(req ,res)=>{
    try{
            const {email,password}=req.body
            if(!email||!password){
                return res.status(400).json({message:"all fields are required"})
            }
            const user= await User.findOne({email})
            if(!user){
                return res.status(400).json({message:"User does not exist"})
            }
            const isMatched = await bcrypt.compare(password,user.password);
        
        if(!isMatched){
             return res.status(404).json({message:"wrong credentials"})
        }
        const payload ={
            name:user.name,
            email:user.email,
            id :user._id,
        }
        console.log(req.user)

        const token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"3h"})
        res.status(201).json({
            token,
            user,
            success:true,
            message:"logged inn"
        })
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}