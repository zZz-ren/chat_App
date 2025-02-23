"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_controllers_1 = require("../controllers/auth.controllers");
var auth_middleware_1 = require("../middleware/auth.middleware");
var router = express_1.default.Router();
router.post("/signup", auth_controllers_1.signup);
router.post("/login", auth_controllers_1.login);
router.get("/logout", auth_controllers_1.logout);
router.post("/update-profile", auth_middleware_1.authenticateRoute, auth_controllers_1.updateProfile);
router.get("/check", auth_middleware_1.authenticateRoute, auth_controllers_1.checkAuth);
exports.default = router;
