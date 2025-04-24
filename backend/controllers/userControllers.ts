import { Request, Response } from 'express';
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const  User =require('../model/userModel') ; 
import dotenv from "dotenv"
dotenv.config()

const registerUser=async (req: Request, res: Response) => {
    try {
      const { userName, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         res.status(400).json({ message: "Email already in use" });
      }else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          userName,
          email,
          password: hashedPassword,
        });
        const savedUser = await newUser.save();
        res.status(201).json({
          user: {
            userName: savedUser.userName,
            email: savedUser.email,
          },
          message: "User registered successfully",
        });
      }
      
     
  
    } catch (error) {
      console.error("Registration Error:", error);
       res.status(400).json({ message: "Error registering user", error });
    }
  };
  
  
  const loginUser= async (req: Request, res: Response) => {
    const { userName, password } = req.body;
  
    const user =await User.findOne({userName});
    if (user) {
      const ispasswordValid = await bcrypt.compare(password, user.password);
      if (ispasswordValid) {
        const token = await jwt.sign( {id:user._id} , process.env.secretkey, {
          expiresIn: "1h",
        });
        res.json({ token });
      } else {
        console.log("invalid password for the user", userName);
        res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      console.log("user not found : ", userName);
      res.status(401).json({ message: "Invalid credentials" });
    }
  };

  export {registerUser,loginUser}