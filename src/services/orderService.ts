import Cart, { ICart } from "../models/cartSchema";
import Product, { IProduct } from "../models/productSchema";
import Customer, { ICustomer } from "../models/customerSchema";
import Order, { IOrder, OrderStatus } from "../models/orderSchema";
import { CustomError } from "../middleware/error";

export const createOrderInCart = async (customerId: string, paymentMethod: string, shippingAddress: string) => {
  try {
    const customer: ICustomer | null = await Customer.findById(customerId);
    if (!customer) {
      throw new CustomError("Customer not found", 404);
    }

    const cartItems: ICart[] = await Cart.find({ customerId });

    if (cartItems.length === 0) {
      throw new CustomError("Cart is empty", 200);
    }

    const products: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: string;
    }> = await Promise.all(
      cartItems.map(async (cartItem) => {
        const product: IProduct | null = await Product.findOne({ _id: cartItem.productId });
        if (!product) {
          throw new CustomError(`Product not found for ID: ${cartItem.productId}`, 400);
        }
        return {
          productId: product._id,
          productName: product.productName,
          quantity: cartItem.quantity,
          price: product.price,
        };
      })
    );

    const totalAmount = products.reduce((total, product) => total + Number(product.price) * product.quantity, 0);
    if (Number(customer.points) < totalAmount) {
      throw new CustomError("Insufficient points", 401);
    }

    customer.points -= totalAmount;
    const order: IOrder = await Order.create({
      customerId: customer._id,
      customerName: customer.customerName,
      products,
      totalAmount: String(totalAmount),
      paymentMethod,
      shippingAddress,
      status: OrderStatus.PROCESSING,
    });

    await Cart.deleteMany({ customerId });

    return order;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("An error occurred during createcart.", (err as { statusCode?: number }).statusCode || 400);
  }
};
