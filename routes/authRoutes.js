import express from 'express'
import { loginUser, registerUser, verifyUser } from '../controllers/authController.js';
import upload from "../middleware/upload.js";

const router=express.Router()

router.post('/register',upload.single("profileImage"),registerUser)
router.post('/login',loginUser)
router.get("/verify/:code", verifyUser);

export default router;