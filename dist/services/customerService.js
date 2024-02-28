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
exports.customerSignIn = exports.customerSignUp = void 0;
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../middleware/error");
const hashPassword = (plaintextPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return bcrypt_1.default.hash(plaintextPassword, saltRounds);
});
const customerEmailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const customerPWRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const customerPhoneNumberRegex = /^[0-9]{10,11}$/;
const customerSignUp = ({ customerName, customerPhoneNumber, customerEmail, customerPw, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!customerEmailRegex.test(customerEmail)) {
        throw new error_1.CustomError("INVALID_USER_EMAIL", 400);
    }
    if (!customerPWRegex.test(customerPw)) {
        throw new error_1.CustomError("INVALID_USER_PASSWORD", 400);
    }
    if (!customerPhoneNumberRegex.test(customerPhoneNumber)) {
        throw new error_1.CustomError("INVALID_USER_PHONENUMBER", 400);
    }
    const hashedPassword = yield hashPassword(customerPw);
    const newCustomer = new customerSchema_1.default({
        customerName,
        customerEmail,
        customerPhoneNumber,
        customerPw: hashedPassword,
    });
    return newCustomer.save();
});
exports.customerSignUp = customerSignUp;
const customerSignIn = (customerEmail, customerPw) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customerSchema_1.default.findOne({ customerEmail: customerEmail }).exec();
    if (!customer) {
        throw new error_1.CustomError("SPECIFIED USER DOES NOT EXIST", 400);
    }
    const result = yield bcrypt_1.default.compare(customerPw, customer.customerPw);
    if (!result) {
        throw new error_1.CustomError("INVALID PASSWORD", 400);
    }
    const accessToken = jsonwebtoken_1.default.sign({ id: customer.id, email: customer.customerEmail }, process.env.SECRET_JWT_KEY);
    return accessToken;
});
exports.customerSignIn = customerSignIn;
