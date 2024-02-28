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
exports.getProductInStoreById = exports.createProduct = void 0;
const productSchema_1 = __importDefault(require("../models/productSchema"));
const error_1 = require("../middleware/error");
const storeSchema_1 = __importDefault(require("../models/storeSchema"));
const createProduct = (userId, storeName, productName, imageUrl, price, description) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield storeSchema_1.default.findOne({ userId, storeName });
        if (!store) {
            throw new error_1.CustomError("Store not found.", 404);
        }
        const formattedPrice = `$${price}`;
        const newProduct = new productSchema_1.default({
            storeId: store._id.toString(),
            storeName,
            productName,
            price: formattedPrice,
            imageUrl,
            description,
        });
        return newProduct.save();
    }
    catch (error) {
        throw error;
    }
});
exports.createProduct = createProduct;
const getProductInStoreById = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const products = yield productSchema_1.default.find({ storeId }).exec();
        const processedProducts = {
            storeName: ((_a = products[0]) === null || _a === void 0 ? void 0 : _a.storeName) || "",
            data: products.map((product) => ({
                productName: product.productName,
                price: product.price,
                imageUrl: product.imageUrl,
                description: product.description,
            })),
        };
        return processedProducts;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.getProductInStoreById = getProductInStoreById;
