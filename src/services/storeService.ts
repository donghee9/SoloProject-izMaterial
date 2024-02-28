import Store, { IStore } from "../models/storeSchema";
import { CustomError } from "../middleware/error";
import Margin from "../models/marginSchema";

const maxPostsPerUser = 3;

export const createStores = async (
  userId: string,
  storeName: string,
  storeManagementCount: number,
  account: string,
  postNumber: string,
  city: string,
  district: string,
  detailAddress: string
) => {
  try {
    const userStoreCount = await Store.countDocuments({ userId });
    if (userStoreCount >= maxPostsPerUser) {
      throw new CustomError("MAX_POSTS_PER_USER_REACHED", 400);
    }

    const newStore = new Store({
      userId,
      storeName,
      storeManagementCount,
      account,
      postNumber,
      city,
      district,
      detailAddress,
    });

    return newStore.save();
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("An error occurred during createstore.", (err as { statusCode?: number }).statusCode || 400);
  }
};
export const patchAddress = async (
  userId: string,
  storeName: string,
  postNumber: string,
  city: string,
  district: string,
  detailAddress: string
) => {
  try {
    const store: IStore | null = await Store.findOne({ userId, storeName });

    if (!store) {
      throw new CustomError("Store not found.", 404);
    }

    store.storeName = storeName;
    store.postNumber = postNumber;
    store.city = city;
    store.district = district;
    store.detailAddress = detailAddress;

    await store.save();
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("An error occurred during patchaddress.", (err as { statusCode?: number }).statusCode || 400);
  }
};

export const patchAccount = async (
  userId: string,
  storeName: string,
  storeManagementCount: number,
  currentAccount: string,
  newAccount: string
) => {
  try {
    const store: IStore | null = await Store.findOne({
      userId,
      account: currentAccount,
    });

    if (!store) {
      throw new CustomError("Store not found.", 404);
    }

    if (currentAccount !== store.account) {
      throw new CustomError("Invalid account.", 400);
    }

    const existingStoreWithNewAccount: IStore | null = await Store.findOne({
      userId,
      account: newAccount,
    });

    if (existingStoreWithNewAccount) {
      throw new CustomError("Duplicate account. Please choose a different one.", 400);
    }

    const storeId = `${userId}-${newAccount}`;

    store.storeName = storeName;
    store.storeManagementCount = storeManagementCount;
    store.account = newAccount;

    await store.save();

    await Margin.updateMany({ storeId: `${userId}-${currentAccount}` }, { storeName, storeId });
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("An error occurred during patchaccount", (err as { statusCode?: number }).statusCode || 400);
  }
};

export const deleteUserStore = async (userId: string, Id: string) => {
  try {
    const stores: IStore[] = await Store.find({ userId });
    if (stores.length === 0) {
      throw new CustomError("No stores found for the user.", 404);
    }

    let storeToDelete: IStore | null = null;

    for (const store of stores) {
      if (store._id.toString() === Id) {
        storeToDelete = store;
        break;
      }
    }

    if (!storeToDelete) {
      throw new CustomError(`No store with id '${Id}' found for the user.`, 404);
    }

    await Store.deleteOne({ _id: Id });

    return { message: "Store deleted successfully", storeName: storeToDelete.storeName };
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during deleted store.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};

export const viewAllStore = async (): Promise<Array<Partial<IStore>>> => {
  try {
    const stores = await Store.aggregate([
      {
        $group: {
          _id: "$storeManagementCount",
          stores: {
            $push: {
              storeName: "$storeName",
              postNumber: "$postNumber",
              city: "$city",
              district: "$district",
              detailAddress: "$detailAddress",
            },
          },
        },
      },
    ]);

    return stores;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("An error occurred during getstore.", (err as { statusCode?: number }).statusCode || 400);
  }
};

export const allMyStorelist = async (userId: string): Promise<Array<any>> => {
  try {
    const userStores = await Store.find({ userId });

    const myStores: Array<any> = [];

    userStores.forEach((store) => {
      myStores.push({
        storeId: store._id,
        storeName: store.storeName,
        account: store.account,
        storeManagementCount: store.storeManagementCount,
        postNumber: store.postNumber,
        city: store.city,
        district: store.district,
        detailAddress: store.detailAddress,
      });
    });

    return myStores;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during allmystorelist.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};
