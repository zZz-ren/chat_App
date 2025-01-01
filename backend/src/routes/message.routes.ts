import express, { Request, Response } from "express";
import { authenticateRoute } from "../middleware/auth.middleware";
import {
  getMessages,
  sendMessage,
  getUsersForSidebar,
} from "../controllers/message.controllers";

const router = express.Router();

router.get("/users", authenticateRoute, getUsersForSidebar);
router.get("/:id", authenticateRoute, getMessages);
router.post("/send/:id", authenticateRoute, sendMessage);

export default router;
