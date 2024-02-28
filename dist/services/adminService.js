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
exports.updateUserOrCustomerPoints = exports.adminSecondSignIn = exports.adminSignIn = void 0;
const adminSchema_1 = __importDefault(require("../models/adminSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../middleware/error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const adminSignIn = (adminId, adminPw) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminSchema_1.default.findOne({ adminId: adminId }).exec();
        if (!admin) {
            throw new error_1.CustomError("SPECIFIED ADMIN DOES NOT EXIST", 400);
        }
        const result = yield bcrypt_1.default.compare(adminPw, admin.adminPw);
        if (!result) {
            throw new error_1.CustomError("INVALID PASSWORD", 400);
        }
        const adminLoginToken = jsonwebtoken_1.default.sign({ id: admin.id }, process.env.SECRET_JWT_KEY_ADMIN);
        return adminLoginToken;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.adminSignIn = adminSignIn;
const adminSecondSignIn = (adminLoginCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminSchema_1.default.findOne({ adminLoginCode: adminLoginCode }).exec();
        if (!admin) {
            throw new error_1.CustomError("SPECIFIED ADMIN DOES NOT EXIST", 400);
        }
        const adminLoginToken = jsonwebtoken_1.default.sign({ id: admin.id }, process.env.SECRET_JWT_KEY_ADMIN);
        return adminLoginToken;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.adminSecondSignIn = adminSecondSignIn;
const updateUserOrCustomerPoints = (points, userpointid, nextArgument) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let updatedDoc;
        if (nextArgument === 0) {
            updatedDoc = yield userSchema_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(userpointid) }, { $inc: { points: points } }, { new: true });
        }
        else if (nextArgument === 1) {
            updatedDoc = yield customerSchema_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(userpointid) }, { $inc: { points: points } }, { new: true });
        }
        else {
            throw new error_1.CustomError("Invalid nextArgument value.", 400);
        }
        if (!updatedDoc) {
            throw new error_1.CustomError("Document not found.", 404);
        }
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.updateUserOrCustomerPoints = updateUserOrCustomerPoints;
