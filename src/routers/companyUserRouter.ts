import express, { Router } from "express";
const router: Router = express.Router();
import { findUser, createUser } from "../controllers/userController";
import { createProducts, deleteProduct, getProductInStore } from "../controllers/productController";
import { forCompanyValidateToken } from "../middleware/auth";
import {
  createStore,
  patchAddressStore,
  patchAccountStore,
  deleteStore,
  allMyStores,
  getAllStoreByManagementCount,
} from "../controllers/storeController";

import { createGrossMargin, myStoreMargins, allMyStore } from "../controllers/marginController";


//회원가입 로그인
router.post("/signIn", findUser);
router.post("/signUp", createUser);
//스토어 불러오기
router.get("/allCompanyStore", forCompanyValidateToken, allMyStores);
//전체페이지에서 storemanagement에 의해 store 불러오기
router.get("/allStoreByManagement", getAllStoreByManagementCount);
//스토어 관련
router.post("/createStore", forCompanyValidateToken, createStore);
router.patch("/patchAddressStore", forCompanyValidateToken, patchAddressStore);
router.patch("/patchAccountStore", forCompanyValidateToken, patchAccountStore);
router.delete("/deleteStore", forCompanyValidateToken, deleteStore);
//제품등록관련
router.post("/createProduct", forCompanyValidateToken, createProducts);
router.delete("/deleteProduct", forCompanyValidateToken, deleteProduct);
router.get("/myProduct", forCompanyValidateToken, getProductInStore);
//마진관리
router.post("/createMargin", forCompanyValidateToken, createGrossMargin);
router.post("/myStoreMarginList", forCompanyValidateToken, myStoreMargins);
router.get("/compareMystore", forCompanyValidateToken, allMyStore);

export default router;
