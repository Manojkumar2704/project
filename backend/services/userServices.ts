import User from "../model/userModel"
import bcrypt from "bcrypt"
// const User =require("../model/userModel") 
// const bcrypt=require("bcrypt")
import jwt from"jsonwebtoken"
// const jwt=require("jsonwebtoken")
import dotenv from "dotenv"
dotenv.config()

class UserService{
    async registerUser(userName:string,email:string,password:string){
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error ("Email already in use")
         }else{
           const hashedPassword = await bcrypt.hash(password, 10);
           const newUser = new User({
             userName,
             email,
             password: hashedPassword,
           });
           const savedUser = await newUser.save();
           return savedUser
    }
}
}

class LoginService{
   async loginUser(userName:string,password:string){
    const user =await User.findOne({userName});
      if (user) {
        const ispasswordValid = bcrypt.compare(String(password),String(user.password) );
        if (await ispasswordValid) {
          const token = jwt.sign({ id: user._id },String(process.env.secretkey) , {
            expiresIn: "1h",
          });
         return token
        } else {
          console.log("invalid password for the user", userName);
         throw new Error("Invalid password for the user")
        }
      } else {
        console.log("user not found : ", userName);
        throw new Error("User not found")
      }
    };
   }


export {UserService,LoginService}