import Admin, { IAdmin } from "../models/adminSchema";
import jwt from "jsonwebtoken";
import { CustomError } from "../middleware/error";
import bcrypt from "bcrypt";
import User from "../models/userSchema";
import Customer from "../models/customerSchema";
import mongoose from "mongoose";
import StoreManagement from "../models/storeManagementSchema";

export const adminSignIn = async (adminId: string, adminPw: string) => {
  try {
    const admin: IAdmin | null = await Admin.findOne({ adminId: adminId }).exec();
    if (!admin) {
      throw new CustomError("SPECIFIED ADMIN DOES NOT EXIST", 400);
    }
    const result = await bcrypt.compare(adminPw, admin.adminPw);
    if (!result) {
      throw new CustomError("INVALID PASSWORD", 400);
    }
    const adminLoginToken = jwt.sign({ id: admin.id }, process.env.SECRET_JWT_KEY_ADMIN as string);
    return adminLoginToken;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during admin frist sign-in.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};

export const adminSecondSignIn = async (adminLoginCode: string) => {
  try {
    const admin: IAdmin | null = await Admin.findOne({ adminLoginCode: adminLoginCode }).exec();
    if (!admin) {
      throw new CustomError("SPECIFIED ADMIN DOES NOT EXIST", 400);
    }
    const adminLoginToken = jwt.sign({ id: admin.id }, process.env.SECRET_JWT_KEY_ADMIN as string);
    return adminLoginToken;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during admin last sign-in.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};

export const updateUserOrCustomerPoints = async (points: number, userpointid: string, nextArgument: number) => {
  try {
    let updatedDoc;

    if (nextArgument === 0) {
      updatedDoc = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userpointid) },
        { $inc: { points: points } },
        { new: true }
      );
    } else if (nextArgument === 1) {
      updatedDoc = await Customer.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userpointid) },
        { $inc: { points: points } },
        { new: true }
      );
    } else {
      throw new CustomError("Invalid nextArgument value.", 400);
    }

    if (!updatedDoc) {
      throw new CustomError("Document not found.", 404);
    }
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during admin frist sign-in.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};

export const createStoreManagements = async function (typeName: string) {
  let storeManagementCount: number | undefined;
  switch (typeName) {
    case "glass":
      storeManagementCount = 1;
      break;
    case "tile/carpet":
      storeManagementCount = 2;
      break;
    case "wallpaper":
      storeManagementCount = 3;
      break;
    case "paint":
      storeManagementCount = 4;
      break;
  }

  const newManagement = new StoreManagement({
    typeName: typeName,
    storeManagementCount: storeManagementCount,
  });
  return newManagement.save();
};
