import { CustomError } from "../middleware/error";
import mongoose from "mongoose";
import Customer from "../models/customerSchema";
import Store from "../models/storeSchema";
import Product from "../models/productSchema";
import Cart from "../models/cartSchema";

export const createCart = async (customerId: string, storeId: string, productId: string, quantity: number) => {
  try {
    const objectIdForCustomer = new mongoose.Types.ObjectId(customerId);
    const matchingCustomer = await Customer.findOne({ _id: objectIdForCustomer });
    if (!matchingCustomer) {
      throw new CustomError("No matching customer found", 404);
    }

    const objectIdForStore = new mongoose.Types.ObjectId(storeId);
    const matchingStore = await Store.findOne({ _id: objectIdForStore });
    if (!matchingStore) {
      throw new CustomError("No matching store found", 404);
    }

    const objectIdForProduct = new mongoose.Types.ObjectId(productId);
    const matchingProduct = await Product.findOne({ _id: objectIdForProduct });
    if (!matchingProduct) {
      throw new CustomError("No matching product found", 404);
    }

    const newCart = new Cart({
      customerId: matchingCustomer._id,
      customerName: matchingCustomer.customerName,
      storeId: matchingStore._id,
      storeName: matchingStore.storeName,
      productId: matchingProduct._id,
      productName: matchingProduct.productName,
      quantity: quantity,
    });

    await newCart.save();

    return {
      customerName: matchingCustomer.customerName,
      storeName: matchingStore.storeName,
      productName: matchingProduct.productName,
    };
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("An error occurred during create cart.", (err as { statusCode?: number }).statusCode || 400);
  }
};

export const getCustomercarts = async (customerId: string) => {
  try {
    const matchingCarts = await Cart.find({ customerId });

    if (!matchingCarts || matchingCarts.length === 0) {
      throw new CustomError("No matching customer carts found", 404);
    }

    const productIds = matchingCarts.map((cart) => cart.productId);

    const result: any[] = [];
    const cartMap: Record<string, { quantity: number; totalPrice: number }> = {};

    matchingCarts.forEach((cart) => {
      const key = `${cart.customerName}-${cart.storeName}-${cart.productName}`;
      if (!cartMap[key]) {
        cartMap[key] = { quantity: cart.quantity, totalPrice: 0 };
      } else {
        cartMap[key].quantity += cart.quantity;
      }
    });

    await Promise.all(
      Object.entries(cartMap).map(async ([key, cartInfo]) => {
        const [customerName, storeName, productName] = key.split("-");
        const matchingProduct = await Product.findOne({ _id: productIds[0] });
        if (!matchingProduct) {
          throw new CustomError(`No matching product found for productId: ${productIds[0]}`, 404);
        }

        const totalPrice = parseFloat(matchingProduct.price) * cartInfo.quantity;
        result.push({
          customerName: customerName,
          storeName: storeName,
          productName: productName,
          quantity: cartInfo.quantity,
          eachPrice: matchingProduct.price,
          totalPrice: totalPrice,
        });
      })
    );

    return result;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("An error occurred during get cart.", (err as { statusCode?: number }).statusCode || 400);
  }
};
