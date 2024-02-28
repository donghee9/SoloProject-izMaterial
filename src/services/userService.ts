import User, { IUser } from "../models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError } from "../middleware/error";

const hashPassword = async (plaintextPassword: string) => {
  const saltRounds = 10;
  return bcrypt.hash(plaintextPassword, saltRounds);
};

const userEmailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const userPWRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const phoneNumberRegex = /^[0-9]{10,11}$/;

export const signup = async (
  userName: string,
  phoneNumber: string,
  userEmail: string,
  storeManagementCount: number,
  companyName: string,
  userPw: string
) => {
  try {
    if (!userEmailRegex.test(userEmail)) {
      throw new CustomError("INVALID_USER_EMAIL", 400);
    }

    if (!userPWRegex.test(userPw)) {
      throw new CustomError("INVALID_USER_PASSWORD", 400);
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      throw new CustomError("INVALID_USER_PHONENUMBER", 400);
    }

    const hashedPassword = await hashPassword(userPw);
    const newUser = new User({
      userName,
      phoneNumber,
      userEmail,
      storeManagementCount,
      companyName,
      userPw: hashedPassword,
    });

    return newUser.save();
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("An error occurred during signup.", (err as { statusCode?: number }).statusCode || 400);
  }
};

export const signin = async (email: string, password: string) => {
  try {
    const user: IUser | null = await User.findOne({ userEmail: email }).exec();
    if (!user) {
      throw new CustomError("SPECIFIED USER DOES NOT EXIST", 400);
    }

    const result = await bcrypt.compare(password, user.userPw);
    if (!result) {
      throw new CustomError("INVALID PASSWORD", 400);
    }

    const accessToken = jwt.sign({ id: user.id, email: user.userEmail }, process.env.SECRET_JWT_KEY as string);
    return accessToken;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("An error occurred during signin.", (err as { statusCode?: number }).statusCode || 400);
  }
};
