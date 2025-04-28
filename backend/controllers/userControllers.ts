import { Request, Response } from 'express';

import { addEmailJob } from '../mail/emailJob';
import { cronMail } from '../mail/mail';
import {UserService,LoginService} from '../services/userServices';
const userService=new UserService()
const loginService=new LoginService()

class UserController{
  async register(req: Request, res: Response): Promise<void>{
    const { userName, email, password } = req.body;
    try {
     await userService.registerUser(userName,email,password)
     cronMail(email)
     await addEmailJob(email)
        res.status(201).json({
                  user: {
                    userName:userName,
                    email:email,
                  },
                  message: "User registered successfully",
                });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.error(error);
      if (error.message === "Email already in use") {
         res.status(409).json({ message: error.message });
      } else {
         res.status(500).json({ message: "Server error, please try again later" });
      }
    }
  }
}

class LoginController{
  async login(req:Request,res:Response){
    const{userName,password}=req.body;
    try {
     const token= await loginService.loginUser(userName,password)
      res.status(200).json({token})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error);
      if(error.message==="Invalid password for the user"){
        res.status(409).json({ message: error.message });
      }if(error.message=="User not found"){
        res.status(409).json({ message: error.message });
      }else{
        res.status(500).json({ message: "Server error, please try again later" });
      }
    }
  }
}

  
  export {UserController,LoginController}