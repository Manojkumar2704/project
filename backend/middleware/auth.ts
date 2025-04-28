import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authmiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.token;

  if (!token || typeof token !== "string") {
    res.status(401).json({ message: "You don't have a valid token" });
    return;
  }

  try {
    const secretKey = process.env.secretkey;
    if (!secretKey) {
      res.status(500).json({ message: "Secret key is missing in environment variables" });
      return;
    }

    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};

export default authmiddleware;
