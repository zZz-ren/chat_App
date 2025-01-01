"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose").default;
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: ""
    }
}, { timestamps: true });
var User = mongoose.model("User", userSchema);
exports.default = User;
