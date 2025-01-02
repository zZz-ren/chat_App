import { connectDB } from "./lib/db";
import dotenv from "dotenv";
import { app, io, server } from "./lib/socket.io";

dotenv.config();

server.listen(process.env.PORT || 5001, () => {
  console.log("server started on http://locahost:", process.env.PORT || 5001);
  connectDB();
});
