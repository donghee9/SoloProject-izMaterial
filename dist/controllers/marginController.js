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
exports.allMyStore = exports.myStoreMargins = exports.createGrossMargin = void 0;
const marginService_1 = require("../services/marginService");
const error_1 = require("../middleware/error");
const storeSchema_1 = __importDefault(require("../models/storeSchema"));
const createGrossMargin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storeId } = req.params;
        const { yearMonth, sales, costs } = req.body;
        console.log(storeId, yearMonth, sales, costs);
        if (!storeId || !yearMonth || !sales || !costs) {
            return res.status(400).json({ error: "KEY_ERROR: Missing required field." });
        }
        const store = yield storeSchema_1.default.findById(storeId);
        if (!store) {
            return res.status(404).json({ error: `Store with ID ${storeId} not found.` });
        }
        yield (0, marginService_1.createGrossMargins)({
            storeId,
            yearMonth,
            sales,
            costs,
        });
        return res.json({ message: "Gross margin created", yearMonth, storeName: store.storeName });
    }
    catch (error) {
        console.log(error);
        if (error instanceof error_1.CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "An error occurred." });
    }
});
exports.createGrossMargin = createGrossMargin;
const myStoreMargins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { account, fristYearMonth, lastYearMonth } = req.body;
    console.log(userId, account, fristYearMonth, lastYearMonth);
    try {
        const storeInfo = yield (0, marginService_1.myStoreMargin)(userId, account, fristYearMonth, lastYearMonth);
        res.json({
            message: storeInfo,
        });
    }
    catch (err) {
        console.log(err);
        if (err instanceof error_1.CustomError) {
            res.status(err.statusCode).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});
exports.myStoreMargins = myStoreMargins;
const allMyStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    try {
        const storeInfo = yield (0, marginService_1.allMyStoreCompare)(userId);
        res.json({
            message: storeInfo,
        });
    }
    catch (err) {
        console.log(err);
        if (err instanceof error_1.CustomError) {
            res.status(err.statusCode).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});
exports.allMyStore = allMyStore;
