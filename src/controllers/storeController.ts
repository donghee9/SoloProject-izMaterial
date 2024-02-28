import { Request, Response } from "express";
import {
  createStores,
  patchAddress,
  patchAccount,
  deleteUserStore,
  viewAllStore,
  allMyStorelist,
} from "../services/storeService";
import { catchAsync } from "../middleware/error";

export const createStore = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { storeName, storeManagementCount, account, postNumber, city, district, detailAddress } = req.body;

  if (!storeName || !storeManagementCount || !account || !postNumber || !city || !district || !detailAddress) {
    res.status(400).json({ error: "KEY_ERROR: Missing required field." });
    return;
  }

  await createStores(userId, storeName, storeManagementCount, account, postNumber, city, district, detailAddress);

  res.json({ message: "Store created successfully", storeName });
});

export const patchAddressStore = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { storeName, postNumber, city, district, detailAddress } = req.body;
  if (!storeName || !postNumber || !city || !district || !detailAddress) {
    res.status(400).json({ error: "KEY_ERROR: Missing required field." });
  }

  await patchAddress(userId, storeName, postNumber, city, district, detailAddress);
  res.json({ message: "store patch successfully", storeName });
});

export const patchAccountStore = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { storeName, storeManagementCount, currentAccount, newAccount } = req.body;
  if (!storeName || !storeManagementCount || !currentAccount || !newAccount) {
    res.status(400).json({ error: "KEY_ERROR: Missing required field." });
  }

  await patchAccount(userId, storeName, storeManagementCount, currentAccount, newAccount);
  res.json({ message: "store account patch successfully", storeName });
});

export const deleteStore = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const Id = req.query.Id as string;

  if (!Id) {
    res.status(400).json({ error: "Missing 'id' parameter." });
  }

  await deleteUserStore(userId, Id);

  res.json({ message: "Store deleted successfully" });
});

export const getAllStoreByManagementCount = catchAsync(async (req: Request, res: Response) => {
  const stores = await viewAllStore();
  res.json({ data: stores });
});

export const allMyStores = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const companyStoreInfo = await allMyStorelist(userId);
  res.json({
    message: companyStoreInfo,
  });
});
