import { Request, Response } from "express";
import {
  createProduct,
  getProductInStoreById,
  deleteProductMystore,
  getProductInstoreManagementCounts,
} from "../services/productService";
import { catchAsync } from "../middleware/error";

export const createProducts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { storeName, productName, price, imageUrl, description } = req.body;
  if (!storeName || !productName || !price || !imageUrl || !description) {
    res.status(400).json({ error: "KEY_ERROR: Missing required field." });
  }

  await createProduct(userId, storeName, productName, price, imageUrl, description);

  res.json({ message: "store product created successfully", productName });
});

export const getProductInStore = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.query.storeId as string;
  const products = await getProductInStoreById(storeId);
  res.json({ data: products });
});

export const getProductInstoreManagementCount = catchAsync(async (req: Request, res: Response) => {
  const storeManagementCountStr = req.query.storeManagementCount as string;
  const storeManagementCount = parseInt(storeManagementCountStr, 10);

  if (isNaN(storeManagementCount)) {
    res.status(400).json({ error: "Invalid companyTypeId" });
  }

  const products = await getProductInstoreManagementCounts(storeManagementCount);
  res.json({ data: products });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.query.storeId as string;
  const productName = req.query.productName as string;

  const result = await deleteProductMystore(storeId, productName);

  res.json({ result, productName });
});
