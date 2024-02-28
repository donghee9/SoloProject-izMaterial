"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const adminController_1 = require("../controllers/adminController");
const typeController_1 = require("../controllers/typeController");
const storeController_1 = require("../controllers/storeController");
const productController_1 = require("../controllers/productController");
const marginController_1 = require("../controllers/marginController");
const storeController_2 = require("../controllers/storeController");
const cartController_1 = require("../controllers/cartController");
const orderController_1 = require("../controllers/orderController");
//로그인
router.post("/fristSignup", adminController_1.getAdminToken);
router.post("/lastSignUp", auth_1.forAdminValidateTokenLogin, adminController_1.adminLogin);
//company유저가 회원가입시 선택할 type관리
router.post("/type", auth_1.forAdminValidateTokenAllProcess, typeController_1.createCompany);
router.post("/franchise-count", auth_1.forAdminValidateTokenAllProcess, typeController_1.createFranchiseCount);
router.post("/discovered-path", auth_1.forAdminValidateTokenAllProcess, typeController_1.createDiscoveredPath);
//스토어 관련
router.post("/createStore", auth_1.forAdminValidateTokenAllProcess, storeController_1.createStore);
router.patch("/patchAddressStore", auth_1.forAdminValidateTokenAllProcess, storeController_1.patchAddressStore);
router.patch("/patchAccountStore", auth_1.forAdminValidateTokenAllProcess, storeController_1.patchAccountStore);
router.delete("/deleteStore/:Id", auth_1.forAdminValidateTokenAllProcess, storeController_1.deleteStore);
//제품등록관련
router.post("/createProduct", auth_1.forAdminValidateTokenAllProcess, productController_1.createProducts);
//마진관리
router.post("/createMargin/:storeId", auth_1.forAdminValidateTokenAllProcess, marginController_1.createGrossMargin);
router.post("/myStoreMarginList", auth_1.forAdminValidateTokenAllProcess, marginController_1.myStoreMargins);
router.get("/compareMystore", auth_1.forAdminValidateTokenAllProcess, marginController_1.allMyStore);
router.get("/allStore", storeController_2.getAllStore);
//제품보기
router.get("/product", productController_1.getProductInStore);
//카트생성
router.post("/createCart", auth_1.forAdminValidateTokenAllProcess, cartController_1.createCarts);
//카트불러오기
router.get("/getAllCustomerCartList", auth_1.forAdminValidateTokenAllProcess, cartController_1.getCustomercart);
//주문하기 ''
router.post("/orderIncart", auth_1.forAdminValidateTokenAllProcess, orderController_1.CustomerCartOrder);
//포인트 주기
router.patch("/point", auth_1.forAdminValidateTokenAllProcess, adminController_1.givePoint);
exports.default = router;
