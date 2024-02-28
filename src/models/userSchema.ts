import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  userName: string;
  phoneNumber: string;
  userEmail: string;
  storeManagementCount: number;
  companyName: string;
  userPw: string;
  points: number;
}

const userSchema: Schema<IUser> = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    storeManagementCount: {
      type: Number,
      required: true,
      unique: false,
    },
    companyName: {
      type: String,
      required: true,
      unique: false,
    },
    userPw: {
      type: String,
      required: true,
      unique: false,
    },
    points: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
