"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var user_model_1 = require("./user.model");
var messageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: user_model_1.default,
        required: true,
    },
    recieverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: user_model_1.default,
        required: true,
    },
    text: { type: String },
    image: { type: String },
}, { timestamps: true });
var Message = mongoose_1.default.model("Message", messageSchema);
exports.default = Message;
// User.js
