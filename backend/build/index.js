"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./lib/db");
var dotenv_1 = __importDefault(require("dotenv"));
var socket_io_1 = require("./lib/socket.io");
dotenv_1.default.config();
socket_io_1.server.listen(process.env.PORT, function () {
    console.log("server started on http://locahost:", process.env.PORT);
    (0, db_1.connectDB)();
});
