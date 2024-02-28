import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAdmin extends Document {
  adminId: string;
  adminPw: string;
  adminLoginCode: string;
}

const adminSchema: Schema<IAdmin> = new Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    adminPw: {
      type: String,
      required: true,
      unique: false,
    },
    adminLoginCode: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
