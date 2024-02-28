import express, { Router } from "express";
const router: Router = express.Router();
import { forAdminValidateTokenLogin, forAdminValidateTokenAllProcess } from "../middleware/auth";
import { getAdminToken, adminLogin, givePoint, createStoreManagement } from "../controllers/adminController";

import { createStore, patchAddressStore, patchAccountStore, deleteStore } from "../controllers/storeController";
import { createProducts, getProductInStore, deleteProduct } from "../controllers/productController";
import { createGrossMargin, myStoreMargins, allMyStore } from "../controllers/marginController";
import { getAllStoreByManagementCount } from "../controllers/storeController";
import { createCarts, getCustomercart } from "../controllers/cartController";
import { CustomerCartOrder } from "../controllers/orderController";

//로그인
router.post("/fristSignup", getAdminToken);
router.post("/lastSignUp", forAdminValidateTokenLogin, adminLogin);
//company유저가 회원가입시 선택할 type관리
router.post("/type", forAdminValidateTokenAllProcess, createStoreManagement);
//스토어 관련
router.post("/createStore", forAdminValidateTokenAllProcess, createStore);
router.patch("/patchAddressStore", forAdminValidateTokenAllProcess, patchAddressStore);
router.patch("/patchAccountStore", forAdminValidateTokenAllProcess, patchAccountStore);
router.delete("/deleteStore/:Id", forAdminValidateTokenAllProcess, deleteStore);
//제품등록관련
router.post("/createProduct", forAdminValidateTokenAllProcess, createProducts);
router.delete("/deleteProduct", forAdminValidateTokenAllProcess, deleteProduct);
router.get("/myProduct", forAdminValidateTokenAllProcess, getProductInStore);
router.get("/allStore", getAllStoreByManagementCount);
//마진관리
router.post("/createMargin/:storeId", forAdminValidateTokenAllProcess, createGrossMargin);
router.post("/myStoreMarginList", forAdminValidateTokenAllProcess, myStoreMargins);
router.get("/compareMystore", forAdminValidateTokenAllProcess, allMyStore);
//카트생성
router.post("/createCart", forAdminValidateTokenAllProcess, createCarts);
//카트불러오기
router.get("/getAllCustomerCartList", forAdminValidateTokenAllProcess, getCustomercart);
//주문하기 ''
router.post("/orderIncart", forAdminValidateTokenAllProcess, CustomerCartOrder);
//포인트 주기
router.patch("/point", forAdminValidateTokenAllProcess, givePoint);
export default router;
