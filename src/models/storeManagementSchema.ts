import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStoreManagement extends Document {
  typeName: "glass" | "tile/carpet" | "wallpaper" | "paint";
  storeManagementCount: number;
}

const storeManagementSchema: Schema<IStoreManagement> = new Schema({
  typeName: {
    type: String,
    required: true,
    enum: ["glass", "tile/carpet", "wallpaper", "paint"],
  },
  storeManagementCount: {
    type: Number,
    required: true,
  },
});

const StoreManagement: Model<IStoreManagement> = mongoose.model<IStoreManagement>(
  "StoreManagement",
  storeManagementSchema
);

export default StoreManagement;
