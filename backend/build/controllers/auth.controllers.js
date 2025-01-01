"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.checkAuth = exports.logout = exports.login = exports.signup = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var user_model_1 = __importDefault(require("../models/user.model"));
var utils_1 = require("../lib/utils");
var cloudinary_1 = __importDefault(require("../lib/cloudinary"));
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, email, password, user, salt, hashedPassword, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                console.log(req);
                _a = req.body, fullName = _a.fullName, email = _a.email, password = _a.password;
                if (password.length < 6) {
                    res.status(400).send({
                        message: "Password must be at least 6 characters",
                        status: true,
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (user)
                    throw new Error("Email already in use");
                return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, bcryptjs_1.default.hash(password, salt)];
            case 3:
                hashedPassword = _b.sent();
                newUser = new user_model_1.default({
                    fullName: fullName,
                    email: email,
                    password: hashedPassword,
                });
                if (!newUser)
                    throw new Error("Invalid User data ");
                (0, utils_1.generateToken)(newUser._id, res);
                return [4 /*yield*/, newUser.save()];
            case 4:
                _b.sent();
                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                    status: true,
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                if (error_1 instanceof Error) {
                    res.status(400).json({ message: error_1.message });
                }
                else
                    res.status(400).json({ error: "Server Error Occured", status: false });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isAuthorized, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 2:
                user = _b.sent();
                if (!user)
                    throw new Error("User credentials not found");
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 3:
                isAuthorized = _b.sent();
                if (!isAuthorized)
                    throw new Error("Invalid credentials");
                (0, utils_1.generateToken)(user._id, res);
                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePic: user.profilePic,
                    status: true,
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                if (error_2 instanceof Error) {
                    res.status(400).json({ message: error_2.message });
                }
                else
                    res.status(400).json({ error: "Server Error Occured", status: false });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var logout = function (req, res) {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            message: "Logged out Successfully",
            status: true,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else
            res.status(400).json({ error: "Internal Server Error ", status: false });
    }
};
exports.logout = logout;
var checkAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        try {
            user = req.user;
            if (!user)
                throw new Error("User not Authenticated");
            res.status(200).json({ status: true, user: user });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            }
            else
                res.status(400).json({ error: "Internal Server Error ", status: false });
        }
        return [2 /*return*/];
    });
}); };
exports.checkAuth = checkAuth;
var updateProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profilePic, userID, uploadResponse, updateUser, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                profilePic = req.body.profilePic;
                console.log(req.body);
                userID = req.user.id;
                if (!profilePic)
                    throw new Error("No profilepic available");
                return [4 /*yield*/, cloudinary_1.default.uploader.upload(profilePic)];
            case 1:
                uploadResponse = _a.sent();
                return [4 /*yield*/, user_model_1.default.findByIdAndUpdate(userID, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password")];
            case 2:
                updateUser = _a.sent();
                res.status(200).json(__assign({ status: true }, updateUser));
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                if (error_3 instanceof Error) {
                    res.status(400).json({ message: error_3.message });
                }
                else
                    res.status(400).json({ error: "Internal Server Error ", status: false });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateProfile = updateProfile;
