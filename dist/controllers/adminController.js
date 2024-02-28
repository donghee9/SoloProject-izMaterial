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
exports.givePoint = exports.adminLogin = exports.getAdminToken = void 0;
const adminService_1 = require("../services/adminService");
const error_1 = require("../middleware/error");
const getAdminToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId, adminPw } = req.body;
    if (!adminId || !adminPw) {
        res.status(400).json({ error: "KEY_ERROR: Missing required fields: email, password." });
        return;
    }
    try {
        const adminfirstToken = yield (0, adminService_1.adminSignIn)(adminId, adminPw);
        res.json({ message: "ADMIN", adminfirstToken });
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
exports.getAdminToken = getAdminToken;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminLoginCode } = req.body;
    if (!adminLoginCode) {
        return res.status(400).json({ error: "KEY_ERROR: Missing required fields: adminLoginCode." });
    }
    try {
        const adminlastToken = yield (0, adminService_1.adminSecondSignIn)(adminLoginCode);
        res.json({ message: "ADMIN", adminlastToken });
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
exports.adminLogin = adminLogin;
const givePoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const customerId = req.query.customerId;
        const points = req.body.points;
        if (!userId && !customerId) {
            return res.status(400).json({ error: "At least one of userId or customerId must be provided." });
        }
        if (points === undefined || points === null) {
            return res.status(400).json({ error: "Points must be provided." });
        }
        let userpointid;
        let nextArgument;
        if (userId) {
            userpointid = userId;
            nextArgument = 0;
        }
        else if (customerId) {
            userpointid = customerId;
            nextArgument = 1;
        }
        else {
            return res.status(400).json({ error: "Invalid userpointid." });
        }
        yield (0, adminService_1.updateUserOrCustomerPoints)(points, userpointid, nextArgument);
        return res.status(200).json({ message: "Points given successfully." });
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
exports.givePoint = givePoint;
