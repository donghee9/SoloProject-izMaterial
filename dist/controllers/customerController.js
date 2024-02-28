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
exports.findCustoemr = exports.createCustomer = void 0;
const customerService_1 = require("../services/customerService");
const error_1 = require("../middleware/error");
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, customerPhoneNumber, customerEmail, customerPw } = req.body;
    console.log(customerName, customerPhoneNumber, customerEmail, customerPw);
    if (!customerName || !customerPhoneNumber || !customerEmail || !customerPw) {
        res.status(400).json({ error: "KEY_ERROR: Missing required field." });
        return;
    }
    try {
        yield (0, customerService_1.customerSignUp)({
            customerName,
            customerPhoneNumber,
            customerEmail,
            customerPw,
        });
        res.json({ message: "created successfully", customerName });
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
exports.createCustomer = createCustomer;
const findCustoemr = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerEmail, customerPw } = req.body;
    if (!customerEmail || !customerPw) {
        res.status(400).json({ error: "KEY_ERROR: Missing required fields: email, password." });
        return;
    }
    try {
        const accessToken = yield (0, customerService_1.customerSignIn)(customerEmail, customerPw);
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
exports.findCustoemr = findCustoemr;
