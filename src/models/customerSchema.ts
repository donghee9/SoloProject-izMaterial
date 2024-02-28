import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICustomer extends Document {
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  customerPw: string;
  points: number;
}

const customerSchema: Schema<ICustomer> = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      unique: false,
    },
    customerEmail: {
      type: String,
      required: true,
      unique: true,
    },
    customerPhoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerPw: {
      type: String,
      required: true,
      unique: false,
    },
    points: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const Customer: Model<ICustomer> = mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;
