import express, { Request, Response } from "express";
import User from "../models/user.model";
import {
  login,
  logout,
  signup,
  checkAuth,
  updateProfile,
} from "../controllers/auth.controllers";
import { authenticateRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/update-profile", authenticateRoute, updateProfile);
router.get("/check", authenticateRoute, checkAuth);

export default router;
