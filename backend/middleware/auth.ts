import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "You don't have a valid token" });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: "You don't have a valid token" });
    return;
  }

  try {
    const secretKey = process.env.secretkey;
    if (!secretKey) {
      res.status(500).json({ message: "Secret key is missing in environment variables" });
      return;
    }

    jwt.verify(token, secretKey, (err) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token", error: err.message });
        
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error instanceof Error ? error.message : error });
  }
};

export default authMiddleware;
