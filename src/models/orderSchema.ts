import mongoose, { Document, Model, Schema } from "mongoose";

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export interface IOrder extends Document {
  customerId: string;
  customerName: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: string;
  }>;
  totalAmount: string;
  paymentMethod: string;
  shippingAddress: string;
  status: OrderStatus;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: String, required: true },
      },
    ],
    totalAmount: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
