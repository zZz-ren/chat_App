import express from "express";
import messageRoutes from "./message.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/messages", messageRoutes);

export default router;
