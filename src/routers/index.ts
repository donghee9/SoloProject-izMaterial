import express from "express";
import companyUserRouter from "./companyUserRouter";
import adminRouter from "./adminRouter";
import customerRouter from "./customerRouter";

const router = express.Router();
router.use("/company", companyUserRouter);
router.use("/admin", adminRouter);
router.use("/customer", customerRouter);

export default router;
