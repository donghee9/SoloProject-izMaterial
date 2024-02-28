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
exports.CustomerCartOrder = void 0;
const orderService_1 = require("../services/orderService");
const error_1 = require("../middleware/error");
const CustomerCartOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.customer) === null || _a === void 0 ? void 0 : _a.id;
        const paymentMethod = req.body.paymentMethod;
        const shippingAddress = req.body.shippingAddress;
        const orderList = yield (0, orderService_1.createOrderInCart)(customerId, paymentMethod, shippingAddress);
        res.json({ data: orderList });
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
exports.CustomerCartOrder = CustomerCartOrder;
