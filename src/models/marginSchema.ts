import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMargin extends Document {
  storeId: string;
  storeName: string;
  yearMonth: string;
  sales: number;
  costs: number;
  grossMargin: number;
  grossProfitMargin: string;
}

const marginSchema: Schema<IMargin> = new Schema<IMargin>(
  {
    storeId: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    yearMonth: {
      type: String,
      required: true,
      unique: true,
    },
    sales: {
      type: Number,
      required: true,
      min: 0,
    },
    costs: {
      type: Number,
      required: true,
      min: 0,
    },
    grossMargin: {
      type: Number,
      required: false,
      min: 0,
    },
    grossProfitMargin: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Margin: Model<IMargin> = mongoose.model<IMargin>("Margin", marginSchema);

export default Margin;
