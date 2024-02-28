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
exports.myStoreMargin = exports.allMyStoreCompare = exports.createGrossMargins = void 0;
const error_1 = require("../middleware/error");
const marginSchema_1 = __importDefault(require("../models/marginSchema"));
const storeSchema_1 = __importDefault(require("../models/storeSchema"));
const validateYearMonth = (yearMonth) => {
    if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
        throw new error_1.CustomError(`${yearMonth} is not in yyyy-mm format!`, 400);
    }
};
const createGrossMargins = ({ storeId, yearMonth, sales, costs, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        validateYearMonth(yearMonth);
        const store = yield storeSchema_1.default.findById(storeId);
        if (!store) {
            throw new error_1.CustomError(`Store with ID ${storeId} not found.`, 404);
        }
        const grossMargin = sales - costs;
        const grossProfitMargin = ((grossMargin / sales) * 100).toFixed(2);
        const newMargin = new marginSchema_1.default({
            storeId,
            storeName: store.storeName,
            yearMonth,
            sales,
            costs,
            grossMargin,
            grossProfitMargin: `${grossProfitMargin}%`,
        });
        yield newMargin.save();
        return newMargin;
    }
    catch (error) {
        console.log(error);
        if (error instanceof error_1.CustomError) {
            throw error;
        }
        else {
            throw new error_1.CustomError("INTERNAL_SERVER_ERROR", 500);
        }
    }
});
exports.createGrossMargins = createGrossMargins;
const allMyStoreCompare = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield storeSchema_1.default.find({ userId });
        if (stores.length === 0) {
            throw new Error("No stores found for this user");
        }
        const storeNames = stores.map((store) => store.storeName);
        const margins = yield marginSchema_1.default.find({ storeName: { $in: storeNames } });
        const storeGrossProfitMarginMap = {};
        margins.forEach((margin) => {
            if (!storeGrossProfitMarginMap[margin.storeName]) {
                storeGrossProfitMarginMap[margin.storeName] = [];
            }
            storeGrossProfitMarginMap[margin.storeName].push(parseFloat(margin.grossProfitMargin));
        });
        const result = stores.map((store) => {
            const storeMargins = storeGrossProfitMarginMap[store.storeName];
            if (!storeMargins || storeMargins.length === 0) {
                return {
                    storeName: store.storeName,
                    grossProfitMargin: "No margins available",
                };
            }
            const totalGrossProfitMargin = storeMargins.reduce((total, margin) => total + margin, 0);
            const averageGrossProfitMargin = (totalGrossProfitMargin / storeMargins.length).toFixed(2);
            return {
                storeName: store.storeName,
                grossProfitMargin: `${averageGrossProfitMargin}%`,
            };
        });
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.allMyStoreCompare = allMyStoreCompare;
const myStoreMargin = (userId, account, firstYearMonth, lastYearMonth) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield storeSchema_1.default.findOne({ userId, account });
        if (!store) {
            throw new Error("Store not found");
        }
        const margins = yield marginSchema_1.default.find({
            storeId: store._id.toString(),
            yearMonth: { $gte: firstYearMonth, $lte: lastYearMonth },
        });
        if (margins.length === 0) {
            throw new Error("No margins found for this store");
        }
        const totalGrossProfitMargin = margins.reduce((total, margin) => total + parseFloat(margin.grossProfitMargin), 0);
        const averageMargin = (totalGrossProfitMargin / margins.length).toFixed(2);
        let maxPMValue = Number.NEGATIVE_INFINITY;
        let maxPMYearMonth = "";
        let maxPMSales = 0;
        let minPMValue = Number.POSITIVE_INFINITY;
        let minPMYearMonth = "";
        let minPMSales = 0;
        let totalSalesValue = 0;
        for (const margin of margins) {
            const currentMargin = parseFloat(margin.grossProfitMargin);
            if (currentMargin > maxPMValue) {
                maxPMValue = currentMargin;
                maxPMYearMonth = margin.yearMonth;
                maxPMSales = margin.sales;
            }
            if (currentMargin < minPMValue) {
                minPMValue = currentMargin;
                minPMYearMonth = margin.yearMonth;
                minPMSales = margin.sales;
            }
            totalSalesValue += margin.sales;
        }
        const averageSalesValue = totalSalesValue / margins.length;
        return {
            storeName: store.storeName,
            average: {
                Margin: `${averageMargin}%`,
                salesValue: averageSalesValue,
            },
            max: {
                Date: maxPMYearMonth,
                marginValue: `${maxPMValue}%`,
                salesValue: maxPMSales,
            },
            min: {
                Date: minPMYearMonth,
                marginValue: `${minPMValue}%`,
                salesValue: minPMSales,
            },
        };
    }
    catch (error) {
        throw error;
    }
});
exports.myStoreMargin = myStoreMargin;
