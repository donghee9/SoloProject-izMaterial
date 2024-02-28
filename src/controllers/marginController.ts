import { Request, Response } from "express";
import { createGrossMargins, allMyStoreCompare, myStoreMargin } from "../services/marginService";
import { catchAsync } from "../middleware/error";
import Store from "../models/storeSchema";

export const createGrossMargin = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.query.storeId as string;
  const { yearMonth, sales, costs } = req.body;

  if (!storeId || !yearMonth || !sales || !costs) {
    res.status(400).json({ error: "KEY_ERROR: Missing required field." });
  }

  const store = await Store.findById(storeId);

  if (!store) {
    res.status(404).json({ error: `Store with ID ${storeId} not found.` });
  }

  await createGrossMargins(storeId, yearMonth, sales, costs);

  res.json({ message: "Gross margin created", yearMonth });
});

export const myStoreMargins = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { account, firstYearMonth, lastYearMonth } = req.body;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
  }

  if (!account || !firstYearMonth || !lastYearMonth) {
    res.status(400).json({ error: "Account, firstYearMonth, and lastYearMonth must be provided." });
  }

  const storeInfo = await myStoreMargin(userId, account, firstYearMonth, lastYearMonth);

  res.json({
    message: storeInfo,
  });
});

export const allMyStore = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const storeInfo = await allMyStoreCompare(userId);
  res.json({
    message: storeInfo,
  });
});
