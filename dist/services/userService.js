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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../middleware/error");
const hashPassword = (plaintextPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return bcrypt_1.default.hash(plaintextPassword, saltRounds);
});
const userEmailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const userPWRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const phoneNumberRegex = /^[0-9]{10,11}$/;
const signup = ({ userName, phoneNumber, userEmail, companyTypeId, companyName, franchiseCountTypeId, discoveredPathTypeId, userPw, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userEmailRegex.test(userEmail)) {
        throw new error_1.CustomError("INVALID_USER_EMAIL", 400);
    }
    if (!userPWRegex.test(userPw)) {
        throw new error_1.CustomError("INVALID_USER_PASSWORD", 400);
    }
    if (!phoneNumberRegex.test(phoneNumber)) {
        throw new error_1.CustomError("INVALID_USER_PHONENUMBER", 400);
    }
    const hashedPassword = yield hashPassword(userPw);
    const newUser = new userSchema_1.default({
        userName,
        phoneNumber,
        userEmail,
        companyTypeId,
        companyName,
        franchiseCountTypeId,
        discoveredPathTypeId,
        userPw: hashedPassword,
    });
    return newUser.save();
});
exports.signup = signup;
const signin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userSchema_1.default.findOne({ userEmail: email }).exec();
    if (!user) {
        throw new error_1.CustomError("SPECIFIED USER DOES NOT EXIST", 400);
    }
    const result = yield bcrypt_1.default.compare(password, user.userPw);
    if (!result) {
        throw new error_1.CustomError("INVALID PASSWORD", 400);
    }
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.userEmail }, process.env.SECRET_JWT_KEY);
    return accessToken;
});
exports.signin = signin;
