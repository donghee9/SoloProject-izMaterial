import Customer, { ICustomer } from "../models/customerSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError, catchAsync } from "../middleware/error";

const hashPassword = async (plaintextPassword: string) => {
  const saltRounds = 10;
  return bcrypt.hash(plaintextPassword, saltRounds);
};

const customerEmailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const customerPWRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const customerPhoneNumberRegex = /^[0-9]{10,11}$/;

export const customerSignUp = async (
  customerName: string,
  customerPhoneNumber: string,
  customerEmail: string,
  customerPw: string
) => {
  try {
    if (!customerEmailRegex.test(customerEmail)) {
      throw new CustomError("INVALID_USER_EMAIL", 400);
    }

    if (!customerPWRegex.test(customerPw)) {
      throw new CustomError("INVALID_USER_PASSWORD", 400);
    }

    if (!customerPhoneNumberRegex.test(customerPhoneNumber)) {
      throw new CustomError("INVALID_USER_PHONENUMBER", 400);
    }

    const hashedPassword = await hashPassword(customerPw);
    const newCustomer = new Customer({
      customerName,
      customerEmail,
      customerPhoneNumber,
      customerPw: hashedPassword,
    });

    return newCustomer.save();
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during customer sign-up.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};

export const customerSignIn = async (customerEmail: string, customerPw: string) => {
  try {
    const customer: ICustomer | null = await Customer.findOne({ customerEmail: customerEmail }).exec();
    if (!customer) {
      throw new CustomError("SPECIFIED USER DOES NOT EXIST", 400);
    }

    const result = await bcrypt.compare(customerPw, customer.customerPw);
    if (!result) {
      throw new CustomError("INVALID PASSWORD", 400);
    }

    const accessToken = jwt.sign(
      { id: customer.id, email: customer.customerEmail },
      process.env.SECRET_JWT_KEY as string
    );
    return accessToken;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during customer sign-in.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};
