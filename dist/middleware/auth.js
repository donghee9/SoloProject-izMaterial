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
exports.forAdminValidateTokenAllProcess = exports.forAdminValidateTokenLogin = exports.forCustomerValidateToken = exports.forCompanyValidateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("./error");
const forCompanyValidateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new error_1.CustomError("TOKEN_NOT_FOUND", 401);
        }
        const secretJwtKey = process.env.SECRET_JWT_KEY || "";
        const payload = jsonwebtoken_1.default.verify(accessToken, secretJwtKey);
        console.log(payload);
        if (!payload.id || !payload.email || !payload.iat) {
            throw new error_1.CustomError("INVALID_PAYLOAD", 401);
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const tokenExpirationTimestamp = currentTimestamp + Number(process.env.JWT_EXPIRES_IN_FOR_COMPANY);
        if (currentTimestamp > tokenExpirationTimestamp) {
            throw new error_1.CustomError("TOKEN_EXPIRED", 401);
        }
        req.user = { id: payload.id };
        next();
    }
    catch (error) {
        if (error instanceof error_1.CustomError) {
            next(error);
        }
        else {
            next(new error_1.CustomError("INTERNAL_SERVER_ERROR", 500));
        }
    }
});
exports.forCompanyValidateToken = forCompanyValidateToken;
const forCustomerValidateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new error_1.CustomError("TOKEN_NOT_FOUND", 401);
        }
        const secretJwtKey = process.env.SECRET_JWT_KEY || "";
        const payload = jsonwebtoken_1.default.verify(accessToken, secretJwtKey);
        console.log(payload);
        if (!payload.id || !payload.email || !payload.iat) {
            throw new error_1.CustomError("INVALID_PAYLOAD", 401);
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const tokenExpirationTimestamp = currentTimestamp + Number(process.env.JWT_EXPIRES_IN_FOR_CUSTOMER);
        if (currentTimestamp > tokenExpirationTimestamp) {
            throw new error_1.CustomError("TOKEN_EXPIRED", 401);
        }
        req.customer = { id: payload.id };
        next();
    }
    catch (error) {
        if (error instanceof error_1.CustomError) {
            next(error);
        }
        else {
            next(new error_1.CustomError("INTERNAL_SERVER_ERROR", 500));
        }
    }
});
exports.forCustomerValidateToken = forCustomerValidateToken;
const forAdminValidateTokenLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminLoginToken = req.headers.authorization;
        if (!adminLoginToken) {
            throw new error_1.CustomError("TOKEN_NOT_FOUND", 401);
        }
        const secretJwtKey = process.env.SECRET_JWT_KEY_ADMIN || "";
        const payload = jsonwebtoken_1.default.verify(adminLoginToken, secretJwtKey);
        console.log(payload);
        if (!payload.id || !payload.iat) {
            throw new error_1.CustomError("INVALID_PAYLOAD", 401);
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const tokenExpirationTimestamp = currentTimestamp + Number(process.env.JWT_EXPIRES_IN_FOR_ADMIN_LOGIN);
        if (currentTimestamp > tokenExpirationTimestamp) {
            throw new error_1.CustomError("TOKEN_EXPIRED", 401);
        }
        req.admin = { id: payload.id };
        next();
    }
    catch (error) {
        if (error instanceof error_1.CustomError) {
            next(error);
        }
        else {
            next(new error_1.CustomError("INTERNAL_SERVER_ERROR", 500));
        }
    }
});
exports.forAdminValidateTokenLogin = forAdminValidateTokenLogin;
const forAdminValidateTokenAllProcess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new error_1.CustomError("TOKEN_NOT_FOUND", 401);
        }
        const secretJwtKey = process.env.SECRET_JWT_KEY_ADMIN || "";
        const payload = jsonwebtoken_1.default.verify(accessToken, secretJwtKey);
        console.log(payload);
        if (!payload.id || !payload.iat) {
            throw new error_1.CustomError("INVALID_PAYLOAD", 401);
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const tokenExpirationTimestamp = currentTimestamp + Number(process.env.JWT_EXPIRES_IN_FOR_ADMIN_ALL_PROCESS);
        if (currentTimestamp > tokenExpirationTimestamp) {
            throw new error_1.CustomError("TOKEN_EXPIRED", 401);
        }
        req.admin = { id: payload.id };
        next();
    }
    catch (error) {
        if (error instanceof error_1.CustomError) {
            next(error);
        }
        else {
            next(new error_1.CustomError("INTERNAL_SERVER_ERROR", 500));
        }
    }
});
exports.forAdminValidateTokenAllProcess = forAdminValidateTokenAllProcess;
