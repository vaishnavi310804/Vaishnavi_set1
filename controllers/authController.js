    import User from "../models/userModel.js";
    import {cloudinary} from "../config/cloudinary.js";
    import bcrypt from 'bcrypt'
    import jwt from 'jsonwebtoken'
    import crypto from "crypto";
    import transporter from "../config/nodemailer.js";

    export const registerUser=async(req,res)=>{
        try{
            const{name,email,password}=req.body
            const file=req.file
        
            if(!name||!email||!password||!file){
                return res.status(400).json({
                    message:"all fields are required "
                })
            }
            const isuser= await User.findOne({email})
            if(isuser){
                return res.status(400).json({message:"user already exist"})
            }
            const hashedPassword=await bcrypt.hash(password,10)
        const result = await cloudinary.uploader.upload(file.path, {
                folder: "test",
            });

                const verificationCode = crypto.randomBytes(20).toString("hex");
        
            const user = await User.create({
                name,email,password:hashedPassword,isVerified:false,
                verificationCode,
                profileImage:result.secure_url,
            })

            const verifyLink = `${process.env.BASE_URL}/api/auth/verify/${verificationCode}`;

            await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your account",
            html: `
            <h2>Hello ${name},</h2>
            <p>Thanks for registering. Please click the link below to verify your account:</p>
            <a href="${verifyLink}">Verify Email</a>
            <br/><br/>
            <p>If you did not register, please ignore this email.</p>
        `,
        });

            const payload ={
                name:user.name,
                email:user.email,
                id :user._id
            }

            const token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"10h"})
            res.status(200).json({
                token,
                user,
                success:true,
                message:"user registered successfully.Please check your email to verify your account."
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
             if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

            const isMatched = await bcrypt.compare(password,user.password);
        
        if(!isMatched){
             return res.status(400).json({message:"wrong credentials"})
        }
        const payload ={
            name:user.name,
            email:user.email,
            id :user._id,
        }
        console.log(req.user)

        const token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"3h"})
        res.status(200).json({
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

export const verifyUser = async (req, res) => {
  try {
    const { code } = req.params;

    const user = await User.findOne({ verificationCode: code });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};