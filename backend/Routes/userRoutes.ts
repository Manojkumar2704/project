import express from 'express';
import {UserController, LoginController } from "../controllers/userControllers";
const userRouter = express.Router();
const userController=new UserController();
const loginController=new LoginController();


userRouter.post("/register", userController.register);
userRouter.post("/login", loginController.login);

export default userRouter;