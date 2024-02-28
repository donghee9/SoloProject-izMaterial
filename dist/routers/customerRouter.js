"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const customerController_1 = require("../controllers/customerController");
const storeController_1 = require("../controllers/storeController");
const productController_1 = require("../controllers/productController");
const cartController_1 = require("../controllers/cartController");
const orderController_1 = require("../controllers/orderController");
//회원가입 로그인
router.post("signup", customerController_1.createCustomer);
router.post("/signin", customerController_1.findCustoemr);
//스토어 보기
router.get("/allStore", storeController_1.getAllStore);
//제품보기
router.get("/product", productController_1.getProductInStore);
//카트생성
router.post("/createCart", auth_1.forCustomerValidateToken, cartController_1.createCarts);
//카트불러오기
router.get("/getAllCustomerCartList", auth_1.forCustomerValidateToken, cartController_1.getCustomercart);
//주문하기 ''
router.post("/orderIncart", auth_1.forCustomerValidateToken, orderController_1.CustomerCartOrder);
exports.default = router;
