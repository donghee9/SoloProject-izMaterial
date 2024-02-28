import { CustomError } from "../middleware/error";
import Margin, { IMargin } from "../models/marginSchema";
import Store, { IStore } from "../models/storeSchema";

const validateYearMonth = (yearMonth: string) => {
  if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
    throw new CustomError(`${yearMonth} is not in yyyy-mm format!`, 400);
  }
};

export const createGrossMargins = async (storeId: string, yearMonth: string, sales: number, costs: number) => {
  try {
    validateYearMonth(yearMonth);

    const store = await Store.findById(storeId);

    if (!store) {
      throw new CustomError(`Store with ID ${storeId} not found.`, 404);
    }

    const grossMargin = sales - costs;
    const grossProfitMargin = ((grossMargin / sales) * 100).toFixed(2);

    const newMargin: IMargin = new Margin({
      storeId,
      storeName: store.storeName,
      yearMonth,
      sales,
      costs,
      grossMargin,
      grossProfitMargin: `${grossProfitMargin}%`,
    });

    await newMargin.save();

    return newMargin;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during create gross margin",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};

export const allMyStoreCompare = async (userId: string) => {
  try {
    const stores: IStore[] = await Store.find({ userId });

    if (stores.length === 0) {
      throw new Error("No stores found for this user");
    }

    const storeNames = stores.map((store) => store.storeName);

    const margins = await Margin.find({ storeName: { $in: storeNames } });

    const storeGrossProfitMarginMap: Record<string, number[]> = {};

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
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during all ym store compare",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};

interface IMarginAggregate {
  totalGrossProfitMargin: number;
  totalSalesValue: number;
  maxMargin: number;
  maxMarginDoc: IMargin;
  minMargin: number;
  minMarginDoc: IMargin;
  count: number;
}

export const myStoreMargin = async (userId: string, account: string, firstYearMonth: string, lastYearMonth: string) => {
  try {
    const store: IStore | null = await Store.findOne({ userId, account });

    if (!store) {
      throw new Error("Store not found");
    }

    const margins: IMarginAggregate[] = await Margin.aggregate([
      {
        $match: {
          storeId: store._id.toString(),
          yearMonth: { $gte: firstYearMonth, $lte: lastYearMonth },
        },
      },
      {
        $addFields: {
          grossProfitMarginValue: {
            $convert: {
              input: { $replaceOne: { input: "$grossProfitMargin", find: "%", replacement: "" } },
              to: "double",
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalGrossProfitMargin: { $sum: "$grossProfitMarginValue" },
          totalSalesValue: { $sum: "$sales" },
          maxMargin: { $max: "$grossProfitMarginValue" },
          maxMarginDoc: { $max: "$$ROOT" },
          minMargin: { $min: "$grossProfitMarginValue" },
          minMarginDoc: { $min: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (margins.length === 0) {
      throw new Error("No margins found for this store");
    }

    const averageMargin = (margins[0].totalGrossProfitMargin / margins[0].count).toFixed(2);

    return {
      storeName: store.storeName,
      average: {
        Margin: `${averageMargin}%`,
        salesValue: margins[0].totalSalesValue / margins[0].count,
      },
      max: {
        Date: margins[0].maxMarginDoc.yearMonth,
        marginValue: `${margins[0].maxMargin}%`,
        salesValue: margins[0].maxMarginDoc.sales,
      },
      min: {
        Date: margins[0].minMarginDoc.yearMonth,
        marginValue: `${margins[0].minMargin}%`,
        salesValue: margins[0].minMarginDoc.sales,
      },
    };
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during customer store marrgin.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};
