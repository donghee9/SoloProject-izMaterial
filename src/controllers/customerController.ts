import { Request, Response } from "express";
import { customerSignUp, customerSignIn } from "../services/customerService";
import { catchAsync } from "../middleware/error";

export const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const { customerName, customerPhoneNumber, customerEmail, customerPw } = req.body;
  if (!customerName || !customerPhoneNumber || !customerEmail || !customerPw) {
    res.status(400).json({ error: "KEY_ERROR: Missing required field." });
    return;
  }

  await customerSignUp(customerName, customerPhoneNumber, customerEmail, customerPw);

  res.json({ message: "created successfully", customerName });
});

export const findCustoemr = catchAsync(async (req: Request, res: Response) => {
  const { customerEmail, customerPw } = req.body;

  if (!customerEmail || !customerPw) {
    res.status(400).json({ error: "KEY_ERROR: Missing required fields: email, password." });
    return;
  }

  const accessToken = await customerSignIn(customerEmail, customerPw);
  res.json({ message: "Login successful", accessToken });
});
