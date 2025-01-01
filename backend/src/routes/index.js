"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var message_routes_1 = require("./message.routes");
var auth_routes_1 = require("./auth.routes");
var router = express_1.default.Router();
router.use("/auth", auth_routes_1.default);
router.use("/messages", message_routes_1.default);
exports.default = router;
