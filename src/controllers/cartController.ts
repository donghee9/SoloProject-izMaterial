import { Request, Response } from "express";
import { createCart, getCustomercarts } from "../services/cartService";
import { catchAsync } from "../middleware/error";

export const createCarts = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.customer?.id;
  const storeId = req.query.storeId as string;
  const productId = req.query.productId as string;
  const quantity = req.body.quantity;

  const cartData = await createCart(customerId, storeId, productId, quantity);

  res.json({
    message: "Cart created successfully",
    customerName: cartData.customerName,
    storeName: cartData.storeName,
    productName: cartData.productName,
  });
});

export const getCustomercart = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.customer?.id;
  const CartList = await getCustomercarts(customerId);

  res.json({ data: CartList });
});
