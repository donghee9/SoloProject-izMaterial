"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controllers/userController");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const storeController_1 = require("../controllers/storeController");
const marginController_1 = require("../controllers/marginController");
//회원가입 로그인
router.post("/signIn", userController_1.findUser);
router.post("/signUp", userController_1.createUser);
//스토어 관련
router.post("/createStore", auth_1.forCompanyValidateToken, storeController_1.createStore);
router.patch("/patchAddressStore", auth_1.forCompanyValidateToken, storeController_1.patchAddressStore);
router.patch("/patchAccountStore", auth_1.forCompanyValidateToken, storeController_1.patchAccountStore);
router.delete("/deleteStore/:Id", auth_1.forCompanyValidateToken, storeController_1.deleteStore);
//제품등록관련
router.post("/createProduct", auth_1.forCompanyValidateToken, productController_1.createProducts);
//마진관리
router.post("/createMargin/:storeId", auth_1.forCompanyValidateToken, marginController_1.createGrossMargin);
router.post("/myStoreMarginList", auth_1.forCompanyValidateToken, marginController_1.myStoreMargins);
router.get("/compareMystore", auth_1.forCompanyValidateToken, marginController_1.allMyStore);
exports.default = router;
