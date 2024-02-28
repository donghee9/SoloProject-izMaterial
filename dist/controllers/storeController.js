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
exports.getAllStore = exports.deleteStore = exports.patchAccountStore = exports.patchAddressStore = exports.createStore = void 0;
const storeService_1 = require("../services/storeService");
const error_1 = require("../middleware/error");
const createStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { storeName, companyTypeId, bussinessTypeId, account, postNumber, city, district, detailAddress } = req.body;
    if (!storeName ||
        !companyTypeId ||
        !bussinessTypeId ||
        !account ||
        !postNumber ||
        !city ||
        !district ||
        !detailAddress) {
        res.status(400).json({ error: "KEY_ERROR: Missing required field." });
        return;
    }
    try {
        yield (0, storeService_1.createStores)(userId, storeName, companyTypeId, bussinessTypeId, account, postNumber, city, district, detailAddress);
        res.json({ message: "store created successfully", storeName });
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
exports.createStore = createStore;
const patchAddressStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const { storeName, postNumber, city, district, detailAddress } = req.body;
    if (!storeName || !postNumber || !city || !district || !detailAddress) {
        res.status(400).json({ error: "KEY_ERROR: Missing required field." });
        return;
    }
    try {
        yield (0, storeService_1.patchAddress)(userId, storeName, postNumber, city, district, detailAddress);
        res.json({ message: "store patch successfully", storeName });
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
exports.patchAddressStore = patchAddressStore;
const patchAccountStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    const { storeName, companyTypeId, bussinessTypeId, currentAccount, newAccount } = req.body;
    if (!storeName || !companyTypeId || !bussinessTypeId || !currentAccount || !newAccount) {
        res.status(400).json({ error: "KEY_ERROR: Missing required field." });
        return;
    }
    try {
        yield (0, storeService_1.patchAccount)(userId, storeName, companyTypeId, bussinessTypeId, currentAccount, newAccount);
        res.json({ message: "store account patch successfully", storeName });
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
exports.patchAccountStore = patchAccountStore;
const deleteStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    const { Id } = req.params;
    try {
        if (!Id) {
            throw new error_1.CustomError("Missing 'id' parameter.", 400);
        }
        yield (0, storeService_1.deleteUserStore)(userId, Id);
        res.json({ message: "Store deleted successfully" });
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
exports.deleteStore = deleteStore;
const getAllStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield (0, storeService_1.viewAllStore)();
        res.json({ data: stores });
    }
    catch (err) {
        console.error(err);
        if (err instanceof error_1.CustomError) {
            res.status(err.statusCode).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});
exports.getAllStore = getAllStore;
