import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../lib/utils";
import { json } from "stream/consumers";
import cloudinary from "../lib/cloudinary";

export const signup = async (req: Request, res: Response) => {
  try {
    console.log(req);
    
    const {
      fullName,
      email,
      password,
    }: { fullName: string; email: string; password: string } = req.body;
    if (password.length < 6) {
      res.status(400).send({
        message: "Password must be at least 6 characters",
        status: true,
      });
      return;
    }
    const user = await User.findOne({ email });

    if (user) throw new Error("Email already in use");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (!newUser) throw new Error("Invalid User data ");

    generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      status: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else
      res.status(400).json({ error: "Server Error Occured", status: false });
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error(`User credentials not found`);

    const isAuthorized = await bcrypt.compare(password, user.password);

    if (!isAuthorized) throw new Error("Invalid credentials");

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      status: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else
      res.status(400).json({ error: "Server Error Occured", status: false });
  }
};
export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out Successfully",
      status: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else
      res.status(400).json({ error: "Internal Server Error ", status: false });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) throw new Error("User not Authenticated");

    res.status(200).json({ status: true, user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else
      res.status(400).json({ error: "Internal Server Error ", status: false });
  }
};
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body;
    console.log(req.body);
    
    const userID = req.user.id;

    if (!profilePic) throw new Error("No profilepic available");

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updateUser = await User.findByIdAndUpdate(
      userID,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({ status: true, ...updateUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else
      res.status(400).json({ error: "Internal Server Error ", status: false });
  }
};
