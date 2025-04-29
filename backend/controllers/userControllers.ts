import { Request, Response } from 'express';
import { addEmailJob } from '../mail/emailJob';
import { cronMail } from '../mail/mail';
import {UserService,LoginService} from '../services/userServices';
// const loginService=new LoginService()

class UserController {
  constructor(
    private userService = new UserService(),
    private cron = cronMail,
    private emailJob = addEmailJob
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    const { userName, email, password } = req.body;
    try {
      await this.userService.registerUser(userName, email, password);
      this.cron(email);
      await this.emailJob(email);
      res.status(201).json({
        user: { userName, email },
        message: "User registered successfully",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      if (error.message === "Email already in use") {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Server error, please try again later" });
      }
    }
  }
}


class LoginController {
  constructor(private loginService = new LoginService()) {}

  async login(req: Request, res: Response) {
    const { userName, password } = req.body;
    try {
      const token = await this.loginService.loginUser(userName, password);
      res.status(200).json({ token });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (error.message === "Invalid password for the user") {
        res.status(409).json({ message: error.message });
      } else if (error.message === "User not found") {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Server error, please try again later" });
      }
    }
  }
}



  
  export {UserController,LoginController}