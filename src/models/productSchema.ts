import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  storeId: string;
  storeName: string;
  productName: string;
  price: string;
  imageUrl: string;
  description: string;
  remove(): Promise<IProduct>;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    storeId: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

export default Product;
