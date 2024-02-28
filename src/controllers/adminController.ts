import { Request, Response } from "express";
import {
  adminSignIn,
  adminSecondSignIn,
  updateUserOrCustomerPoints,
  createStoreManagements,
} from "../services/adminService";
import { catchAsync } from "../middleware/error";

export const getAdminToken = catchAsync(async (req: Request, res: Response) => {
  const { adminId, adminPw } = req.body;

  if (!adminId || !adminPw) {
    res.status(400).json({ error: "KEY_ERROR: Missing required fields: email, password." });
  }

  const adminfirstToken = await adminSignIn(adminId, adminPw);
  res.json({ message: "ADMIN", adminfirstToken });
});

export const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const { adminLoginCode } = req.body;

  if (!adminLoginCode) {
    res.status(400).json({ error: "KEY_ERROR: Missing required fields: adminLoginCode." });
  }
  const adminLastToken = await adminSecondSignIn(adminLoginCode);
  res.json({ message: "ADMIN", adminLastToken });
});

export const givePoint = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.query.userId as string;
  const customerId = req.query.customerId as string;
  const points = req.body.points;

  if (!userId && !customerId) {
    res.status(400).json({ error: "At least one of userId or customerId must be provided." });
  }

  if (points === undefined || points === null) {
    res.status(400).json({ error: "Points must be provided." });
  }

  let userpointid: string | undefined;
  let nextArgument: number | undefined;

  if (userId) {
    userpointid = userId;
    nextArgument = 0;
  } else if (customerId) {
    userpointid = customerId;
    nextArgument = 1;
  } else {
    res.status(400).json({ error: "Invalid userpointid." });
  }

  if (userpointid !== undefined && nextArgument !== undefined) {
    await updateUserOrCustomerPoints(points, userpointid, nextArgument);
    res.status(200).json({ message: "Points given successfully." });
  } else {
    res.status(400).json({ error: "Invalid userpointid or nextArgument." });
  }
});

export const createStoreManagement = catchAsync(async (req: Request, res: Response) => {
  const { managementType } = req.body;
  const newManagement = await createStoreManagements(managementType);
  res.json(newManagement);
});
