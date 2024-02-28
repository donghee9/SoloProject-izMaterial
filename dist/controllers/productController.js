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
exports.getProductInStore = exports.createProducts = void 0;
const productService_1 = require("../services/productService");
const error_1 = require("../middleware/error");
const createProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { storeName, productName, price, imageUrl, description } = req.body;
    if (!storeName || !productName || !price || !imageUrl || !description) {
        res.status(400).json({ error: "KEY_ERROR: Missing required field." });
        return;
    }
    try {
        yield (0, productService_1.createProduct)(userId, storeName, productName, price, imageUrl, description);
        res.json({ message: "store product created successfully", productName });
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
exports.createProducts = createProducts;
const getProductInStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeId = req.query.storeId;
        const products = yield (0, productService_1.getProductInStoreById)(storeId);
        res.json({ data: products });
    }
    catch (error) {
        if (error instanceof error_1.CustomError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});
exports.getProductInStore = getProductInStore;
