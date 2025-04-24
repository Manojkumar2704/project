import { NextFunction, Request,Response } from "express";
const jwt=require("jsonwebtoken")
import dotenv from "dotenv"
dotenv.config()

const authmiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    const {token}=req.headers;
    if(!token){
         res.status(401).json({message:"You don't have a token"})
    }else{
        try {
            const validToken=jwt.verify(token,process.env.secretkey)
            next()
        } catch (error) {
            res.status(401).json({message:"Invalid token"})
        }
        
    }
}
module.exports=authmiddleware