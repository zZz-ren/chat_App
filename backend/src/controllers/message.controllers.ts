import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../lib/utils";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";
import { getUsersSocketId, io } from "../lib/socket.io";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user.id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    res.status(200).json({
      users: filteredUsers,
      status: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else
      res.status(400).json({ error: "Internal Server Error ", status: false });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recieverId: id },
        { senderId: id, recieverId: senderId },
      ],
    });

    res.status(200).json({ messages: messages, status: true });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else
      res.status(400).json({ error: "Internal Server Error ", status: false });
  }
};
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      recieverId: id,
      senderId: senderId,
      text: text,
      image: imageUrl,
    });

    await newMessage.save();

    const recieverId = getUsersSocketId(id);

    if (recieverId) {
      console.log("controller");
      
      io.to(recieverId).emit("newMessage", newMessage);
    }

    res.status(200).json({ message: newMessage, status: true });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else
      res.status(400).json({ error: "Internal Server Error ", status: false });
  }
};
