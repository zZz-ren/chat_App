"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var message_routes_1 = __importDefault(require("./message.routes"));
var auth_routes_1 = __importDefault(require("./auth.routes"));
var router = express_1.default.Router();
router.use("/auth", auth_routes_1.default);
router.use("/messages", message_routes_1.default);
exports.default = router;
