"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.createUser = void 0;
const userService_1 = require("../services/userService");
const error_1 = require("../middleware/error");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, phoneNumber, userEmail, companyTypeId, companyName, franchiseCountTypeId, discoveredPathTypeId, userPw, } = req.body;
    if (!userName ||
        !phoneNumber ||
        !userEmail ||
        !companyTypeId ||
        !companyName ||
        !franchiseCountTypeId ||
        !discoveredPathTypeId ||
        !userPw) {
        res.status(400).json({ error: "KEY_ERROR: Missing required field." });
        return;
    }
    try {
        yield (0, userService_1.signup)({
            userName,
            phoneNumber,
            userEmail,
            companyTypeId,
            companyName,
            franchiseCountTypeId,
            discoveredPathTypeId,
            userPw,
        });
        res.json({ message: "User created successfully", userName });
    }
    catch (err) {
        if (err instanceof error_1.CustomError) {
            res.status(err.statusCode).json({ message: err.message });
        }
        else {
            console.log(err);
            res.status(500).json({ message: "Internal Server Errorr" });
        }
    }
});
exports.createUser = createUser;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, userPw } = req.body;
    if (!userEmail || !userPw) {
        res.status(400).json({ error: "KEY_ERROR: Missing required fields: email, password." });
        return;
    }
    try {
        const accessToken = yield (0, userService_1.signin)(userEmail, userPw);
        res.json({ message: "Login successful", accessToken });
    }
    catch (err) {
        if (err instanceof error_1.CustomError) {
            res.status(err.statusCode).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});
exports.findUser = findUser;
