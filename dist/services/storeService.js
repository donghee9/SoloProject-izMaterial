"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewAllStore = exports.deleteUserStore = exports.patchAccount = exports.patchAddress = exports.createStores = void 0;
const storeSchema_1 = __importDefault(require("../models/storeSchema"));
const error_1 = require("../middleware/error");
const marginSchema_1 = __importDefault(require("../models/marginSchema"));
const maxPostsPerUser = 3;
const createStores = (userId, storeName, companyTypeId, bussinessTypeId, account, postNumber, city, district, detailAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const userStoreCount = yield storeSchema_1.default.countDocuments({ userId });
    if (userStoreCount >= maxPostsPerUser) {
        throw new error_1.CustomError("MAX_POSTS_PER_USER_REACHED", 400);
    }
    const newStore = new storeSchema_1.default({
        userId,
        storeName,
        companyTypeId,
        bussinessTypeId,
        account,
        postNumber,
        city,
        district,
        detailAddress,
    });
    return newStore.save();
});
exports.createStores = createStores;
const patchAddress = (userId, storeName, postNumber, city, district, detailAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield storeSchema_1.default.findOne({ userId, storeName });
        if (!store) {
            throw new error_1.CustomError("Store not found.", 404);
        }
        store.storeName = storeName;
        store.postNumber = postNumber;
        store.city = city;
        store.district = district;
        store.detailAddress = detailAddress;
        yield store.save();
    }
    catch (error) {
        throw error;
    }
});
exports.patchAddress = patchAddress;
const patchAccount = (userId, storeName, companyTypeId, bussinessTypeId, currentAccount, newAccount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield storeSchema_1.default.findOne({
            userId,
            account: currentAccount,
        });
        if (!store) {
            throw new error_1.CustomError("Store not found.", 404);
        }
        if (currentAccount !== store.account) {
            throw new error_1.CustomError("Invalid account.", 400);
        }
        const existingStoreWithNewAccount = yield storeSchema_1.default.findOne({
            userId,
            account: newAccount,
        });
        if (existingStoreWithNewAccount) {
            throw new error_1.CustomError("Duplicate account. Please choose a different one.", 400);
        }
        const storeId = `${userId}-${newAccount}`;
        store.storeName = storeName;
        store.companyTypeId = companyTypeId;
        store.bussinessTypeId = bussinessTypeId;
        store.account = newAccount;
        yield store.save();
        yield marginSchema_1.default.updateMany({ storeId: `${userId}-${currentAccount}` }, { storeName, storeId });
    }
    catch (error) {
        throw error;
    }
});
exports.patchAccount = patchAccount;
const deleteUserStore = (userId, Id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield storeSchema_1.default.find({ userId });
        if (stores.length === 0) {
            throw new error_1.CustomError("No stores found for the user.", 404);
        }
        let storeToDelete = null;
        for (const store of stores) {
            if (store._id.toString() === Id) {
                storeToDelete = store;
                break;
            }
        }
        if (!storeToDelete) {
            throw new error_1.CustomError(`No store with id '${Id}' found for the user.`, 404);
        }
        yield storeSchema_1.default.deleteOne({ _id: Id });
        return { message: "Store deleted successfully", storeName: storeToDelete.storeName };
    }
    catch (error) {
        throw error;
    }
});
exports.deleteUserStore = deleteUserStore;
const viewAllStore = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield storeSchema_1.default.find({}, {
            storeName: 1,
            postNumber: 1,
            city: 1,
            district: 1,
            detailAddress: 1,
            _id: 0,
        }).exec();
        return stores;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.viewAllStore = viewAllStore;
