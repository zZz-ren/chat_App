import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/utils";
import User from "../models/user.model";

export const authenticateRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies) throw new Error("You must login first");

    const token = req.cookies.jwt;

    if (!token) throw new Error("Unauthorized access");
    const decoded = verifyToken(token);
    if (!decoded) throw new Error("Invalid token");

    const user = await User.findById(decoded).select("-password");
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else
      res.status(400).json({ error: "Internal Server Error ", status: false });
  }
};
