"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyUserRouter_1 = __importDefault(require("./companyUserRouter"));
const adminRouter_1 = __importDefault(require("./adminRouter"));
const customerRouter_1 = __importDefault(require("./customerRouter"));
const router = express_1.default.Router();
router.use("/company", companyUserRouter_1.default);
router.use("/admin", adminRouter_1.default);
router.use("/customer", customerRouter_1.default);
exports.default = router;
