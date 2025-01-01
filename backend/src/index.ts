import { connectDB } from "./lib/db";
import dotenv from "dotenv";
import { app, io, server } from "./lib/socket.io";

dotenv.config();

server.listen(process.env.PORT, () => {
  console.log("server started on http://locahost:", process.env.PORT);
  connectDB();
});
