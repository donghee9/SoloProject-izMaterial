import { Request, Response } from "express";
import { signin, signup } from "../services/userService";
import { CustomError, catchAsync } from "../middleware/error";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    throw new CustomError("METHOD_NOT_ALLOWED.", 405);
  }
  const { userName, phoneNumber, userEmail, storeManagementCount, companyName, userPw } = req.body;

  if (!userName || !phoneNumber || !userEmail || !storeManagementCount || !companyName || !userPw) {
    res.status(400).json({ error: "KEY_ERROR: Missing required field." });
  }

  await signup(userName, phoneNumber, userEmail, storeManagementCount, companyName, userPw);

  res.status(200).json({ message: "User created successfully", userName });
});

export const findUser = catchAsync(async (req: Request, res: Response) => {
  const { userEmail, userPw } = req.body;

  if (!userEmail || !userPw) {
    res.status(400).json({ error: "KEY_ERROR: Missing required fields: email, password." });
    return;
  }

  const accessToken = await signin(userEmail, userPw);
  res.json({ message: "Login successful", accessToken });
});
