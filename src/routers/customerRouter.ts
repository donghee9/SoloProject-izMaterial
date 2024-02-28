import express, { Router } from "express";
const router: Router = express.Router();
import { forCustomerValidateToken } from "../middleware/auth";
import { createCustomer, findCustoemr } from "../controllers/customerController";
import { getAllStoreByManagementCount } from "../controllers/storeController";
import { getProductInStore, getProductInstoreManagementCount } from "../controllers/productController";
import { createCarts, getCustomercart } from "../controllers/cartController";
import { CustomerCartOrder } from "../controllers/orderController";

//회원가입 로그인
router.post("/signup", createCustomer);
router.post("/signin", findCustoemr);
//스토어 보기
router.get("/allStoreByManagement", getAllStoreByManagementCount);
//제품보기
router.get("/productByStore", getProductInStore);
router.get("/productByCompanyTypeId", getProductInstoreManagementCount);
//카트생성
router.post("/createCart", forCustomerValidateToken, createCarts);
//카트불러오기
router.get("/getAllCustomerCartList", forCustomerValidateToken, getCustomercart);
//주문하기 ''
router.post("/orderIncart", forCustomerValidateToken, CustomerCartOrder);

export default router;
