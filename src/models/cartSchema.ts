import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICart extends Document {
  customerId: string;
  customerName: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  quantity: number;
  remove(): Promise<ICart>;
}

const cartSchema: Schema<ICart> = new Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
