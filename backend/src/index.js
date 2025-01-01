"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./lib/db");
var dotenv_1 = require("dotenv");
var socket_io_1 = require("./lib/socket.io");
dotenv_1.default.config();
socket_io_1.server.listen(process.env.PORT, function () {
    console.log("server started on http://locahost:", process.env.PORT);
    (0, db_1.connectDB)();
});
