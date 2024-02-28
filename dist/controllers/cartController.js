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
exports.getCustomercart = exports.createCarts = void 0;
const cartService_1 = require("../services/cartService");
const error_1 = require("../middleware/error");
const createCarts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.customer) === null || _a === void 0 ? void 0 : _a.id;
        const storeId = req.query.storeId;
        const productId = req.query.productId;
        const quantity = req.body.quantity;
        const cartData = yield (0, cartService_1.createCart)(customerId, storeId, productId, quantity);
        res.json({
            message: "Cart created successfully",
            customerName: cartData.customerName,
            storeName: cartData.storeName,
            productName: cartData.productName,
        });
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
exports.createCarts = createCarts;
const getCustomercart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const customerId = (_b = req.customer) === null || _b === void 0 ? void 0 : _b.id;
        yield (0, cartService_1.getCustomercarts)(customerId);
        const CartList = yield (0, cartService_1.getCustomercarts)(customerId);
        res.json({ data: CartList });
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
exports.getCustomercart = getCustomercart;
