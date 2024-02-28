import Product, { IProduct } from "../models/productSchema";
import { CustomError } from "../middleware/error";
import Store from "../models/storeSchema";

export const createProduct = async (
  userId: string,
  storeName: string,
  productName: string,
  imageUrl: string,
  price: string,
  description: string
) => {
  try {
    const store = await Store.findOne({ userId, storeName });

    if (!store) {
      throw new CustomError("Store not found.", 404);
    }

    const formattedPrice = `$${price}`;

    const newProduct = new Product({
      storeId: store._id.toString(),
      storeName,
      productName,
      price: formattedPrice,
      imageUrl,
      description,
    });

    return newProduct.save();
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during createProduct.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};

export interface ProcessedProducts {
  storeName: string;
  data: Array<Partial<IProduct>>;
}

export const getProductInStoreById = async (storeId: string) => {
  try {
    const products = await Product.find({ storeId }).exec();

    const processedProducts: ProcessedProducts = {
      storeName: products[0]?.storeName || "",
      data: products.map((product) => ({
        productName: product.productName,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
      })),
    };

    return processedProducts;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during getProductinStore",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};
export const getProductInstoreManagementCounts = async (storeManagementCount: number) => {
  try {
    const matchingStores = await Store.find({ storeManagementCount }).exec();

    if (!matchingStores || matchingStores.length === 0) {
      throw new Error("No stores found for the given storeManagementCounts");
    }

    const storeNames = matchingStores.map((store) => store.storeName);

    const products = await Product.find({
      storeName: { $in: storeNames },
    }).exec();

    return products;
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError(
      "An error occurred during getProductCompanyId.",
      (err as { statusCode?: number }).statusCode || 400
    );
  }
};

export const deleteProductMystore = async (storeId: string, productName: string) => {
  try {
    const matchingStore = await Product.findOne({ storeId }).exec();

    if (!matchingStore) {
      throw new CustomError("Store not found.", 404);
    }

    const matchingProduct = await Product.findOne({ storeId, productName }).exec();

    if (!matchingProduct) {
      throw new CustomError("Product not found.", 404);
    }

    await matchingProduct.deleteOne();

    return "Product deleted successfully";
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
