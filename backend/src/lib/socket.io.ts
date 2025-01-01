import { Server } from "socket.io";
import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import routes from "../routes/index";
import { Request,Response } from "express";

import cors from "cors";
import path from "path";

const FRONTEND_PATH = path.join(__dirname, "../../../frontend/dist");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api", routes);

app.use(express.static(FRONTEND_PATH));

app.get("*", (req:Request,res:Response) => {
 res.sendFile( path.join( FRONTEND_PATH, "index.html"))
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ["http://localhost:5173"], credentials: true },
});

export const getUsersSocketId = (userId: string) => userSocketMap[userId];

const userSocketMap: { [key: string]: string } = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    console.log("connect", Object.keys(userSocketMap));
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    delete userSocketMap[userId];

    console.log("disconnect", Object.keys(userSocketMap));

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
