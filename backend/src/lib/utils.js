"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var secret = process.env.JWT_SECRET || "thisisatopsecretkey";
var generateToken = function (userID, res) {
    var token = jsonwebtoken_1.default.sign({ userID: userID }, secret, { expiresIn: "7d" });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.MODE !== "development",
    });
};
exports.generateToken = generateToken;
var verifyToken = function (token) {
    try {
        var decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded.userID;
    }
    catch (err) {
        console.error(err);
        return null;
    }
};
exports.verifyToken = verifyToken;
