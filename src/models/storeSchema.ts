import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStore extends Document {
  userId: string;
  storeName: string;
  storeManagementCount: number;
  account: string;
  postNumber: string;
  city: string;
  district: string;
  detailAddress: string;
  remove(): Promise<IStore>;
}

const storeSchema: Schema<IStore> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    storeManagementCount: {
      type: Number,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    postNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    detailAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

storeSchema.index({ userId: 1 }, { unique: false });

const Store: Model<IStore> = mongoose.model<IStore>("Store", storeSchema);

export default Store;
