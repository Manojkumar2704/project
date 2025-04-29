import express from 'express';
import {UserController, LoginController } from "../controllers/userControllers";
const userRouter = express.Router();
const userController=new UserController();
const loginController=new LoginController();


userRouter.post("/register", (req, res) => userController.register(req, res));
userRouter.post("/login",(req,res)=> loginController.login(req,res));

export default userRouter;