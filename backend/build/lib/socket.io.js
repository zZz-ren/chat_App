"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.server = exports.io = exports.getUsersSocketId = void 0;
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var body_parser_1 = __importDefault(require("body-parser"));
var index_1 = __importDefault(require("../routes/index"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var FRONTEND_PATH = path_1.default.join(__dirname, "../../../frontend/dist");
var app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "5mb" }));
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use("/api", index_1.default);
app.use(express_1.default.static(FRONTEND_PATH));
app.get("*", function (req, res) {
    res.sendFile(path_1.default.join(FRONTEND_PATH, "index.html"));
});
var server = http_1.default.createServer(app);
exports.server = server;
var io = new socket_io_1.Server(server, {
    cors: { origin: ["http://localhost:5173"], credentials: true },
});
exports.io = io;
var getUsersSocketId = function (userId) { return userSocketMap[userId]; };
exports.getUsersSocketId = getUsersSocketId;
var userSocketMap = {};
io.on("connection", function (socket) {
    var userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log("User connected: ".concat(userId, " with socket ID: ").concat(socket.id));
        console.log("connect", Object.keys(userSocketMap));
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", function () {
        console.log("User disconnected: ".concat(socket.id));
        delete userSocketMap[userId];
        console.log("disconnect", Object.keys(userSocketMap));
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
