import { Request, Response } from "express";
import { createOrderInCart } from "../services/orderService";
import { catchAsync } from "../middleware/error";

export const CustomerCartOrder = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.customer?.id;
  const paymentMethod = req.body.paymentMethod;
  const shippingAddress = req.body.shippingAddress;

  const orderList = await createOrderInCart(customerId, paymentMethod, shippingAddress);

  res.json({ data: orderList });
});
