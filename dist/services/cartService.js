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
exports.getCustomercarts = exports.createCart = void 0;
const error_1 = require("../middleware/error");
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const storeSchema_1 = __importDefault(require("../models/storeSchema"));
const productSchema_1 = __importDefault(require("../models/productSchema"));
const cartSchema_1 = __importDefault(require("../models/cartSchema"));
const createCart = (customerId, storeId, productId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const objectIdForCustomer = new mongoose_1.default.Types.ObjectId(customerId);
        const matchingCustomer = yield customerSchema_1.default.findOne({ _id: objectIdForCustomer });
        if (!matchingCustomer) {
            throw new error_1.CustomError("No matching customer found", 404);
        }
        const objectIdForStore = new mongoose_1.default.Types.ObjectId(storeId);
        const matchingStore = yield storeSchema_1.default.findOne({ _id: objectIdForStore });
        if (!matchingStore) {
            throw new error_1.CustomError("No matching store found", 404);
        }
        const objectIdForProduct = new mongoose_1.default.Types.ObjectId(productId);
        const matchingProduct = yield productSchema_1.default.findOne({ _id: objectIdForProduct });
        if (!matchingProduct) {
            throw new error_1.CustomError("No matching product found", 404);
        }
        const newCart = new cartSchema_1.default({
            customerId: matchingCustomer._id,
            customerName: matchingCustomer.customerName,
            storeId: matchingStore._id,
            storeName: matchingStore.storeName,
            productId: matchingProduct._id,
            productName: matchingProduct.productName,
            quantity: quantity,
        });
        yield newCart.save();
        return {
            customerName: matchingCustomer.customerName,
            storeName: matchingStore.storeName,
            productName: matchingProduct.productName,
        };
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.createCart = createCart;
const getCustomercarts = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matchingCarts = yield cartSchema_1.default.find({ customerId });
        if (!matchingCarts || matchingCarts.length === 0) {
            throw new error_1.CustomError("No matching customer carts found", 404);
        }
        const productIds = matchingCarts.map((cart) => cart.productId);
        const result = [];
        const cartMap = {};
        matchingCarts.forEach((cart) => {
            const key = `${cart.customerName}-${cart.storeName}-${cart.productName}`;
            if (!cartMap[key]) {
                cartMap[key] = { quantity: cart.quantity, totalPrice: 0 };
            }
            else {
                cartMap[key].quantity += cart.quantity;
            }
        });
        yield Promise.all(Object.entries(cartMap).map(([key, cartInfo]) => __awaiter(void 0, void 0, void 0, function* () {
            const [customerName, storeName, productName] = key.split("-");
            const matchingProduct = yield productSchema_1.default.findOne({ _id: productIds[0] });
            if (!matchingProduct) {
                throw new error_1.CustomError(`No matching product found for productId: ${productIds[0]}`, 404);
            }
            const totalPrice = parseFloat(matchingProduct.price) * cartInfo.quantity;
            result.push({
                customerName: customerName,
                storeName: storeName,
                productName: productName,
                quantity: cartInfo.quantity,
                eachPrice: matchingProduct.price,
                totalPrice: totalPrice,
            });
        })));
        return result;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.getCustomercarts = getCustomercarts;
