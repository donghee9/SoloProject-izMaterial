"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        unique: false,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    companyTypeId: {
        type: Number,
        required: true,
        unique: false,
    },
    companyName: {
        type: String,
        required: true,
        unique: false,
    },
    franchiseCountTypeId: {
        type: Number,
        required: true,
        unique: false,
    },
    discoveredPathTypeId: {
        type: Number,
        required: true,
        unique: false,
    },
    userPw: {
        type: String,
        required: true,
        unique: false,
    },
    enrolled: {
        type: Date,
        default: Date.now,
    },
    points: {
        type: Number,
        required: false,
        default: 0,
    },
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
