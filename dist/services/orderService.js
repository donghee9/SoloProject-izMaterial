"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createOrderInCart = void 0;
const cartSchema_1 = __importDefault(require("../models/cartSchema"));
const productSchema_1 = __importDefault(require("../models/productSchema"));
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const orderSchema_1 = __importStar(require("../models/orderSchema"));
const createOrderInCart = (customerId, paymentMethod, shippingAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customerSchema_1.default.findById(customerId);
        if (!customer) {
            throw new Error("Customer not found");
        }
        const cartItems = yield cartSchema_1.default.find({ customerId });
        if (cartItems.length === 0) {
            throw new Error("Cart is empty");
        }
        const products = yield Promise.all(cartItems.map((cartItem) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield productSchema_1.default.findOne({ _id: cartItem.productId });
            if (!product) {
                throw new Error(`Product not found for ID: ${cartItem.productId}`);
            }
            return {
                productId: product._id,
                productName: product.productName,
                quantity: cartItem.quantity,
                price: product.price,
            };
        })));
        const totalAmount = products.reduce((total, product) => total + Number(product.price) * product.quantity, 0);
        if (Number(customer.points) < totalAmount) {
            throw new Error("Insufficient points");
        }
        customer.points -= totalAmount;
        const order = yield orderSchema_1.default.create({
            customerId: customer._id,
            customerName: customer.customerName,
            products,
            totalAmount: String(totalAmount),
            paymentMethod,
            shippingAddress,
            status: orderSchema_1.OrderStatus.PROCESSING,
        });
        yield cartSchema_1.default.deleteMany({ customerId });
        return order;
    }
    catch (error) {
        throw error;
    }
});
exports.createOrderInCart = createOrderInCart;
