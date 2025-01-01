import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

const secret = process.env.JWT_SECRET || "thisisatopsecretkey";
export const generateToken = (userID: Types.ObjectId, res: Response) => {
  const token = jwt.sign({ userID }, secret, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.MODE !== "development",
  });
};
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret) as { userID: Types.ObjectId };
    return decoded.userID;
  } catch (err) {
    console.error(err);
    return null;
  }
};
