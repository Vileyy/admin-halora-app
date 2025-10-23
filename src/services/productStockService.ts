import { database } from "./firebase";
import { ref, get } from "firebase/database";

const PRODUCTS_REF = "products";

interface ProductVariant {
  price: number;
  size: string;
  stockQty: number;
  sku?: string;
}

interface Product {
  id: string;
  name: string;
  variants: ProductVariant[];
  originalProductId?: string;
  brandId?: string;
  image?: string;
  description?: string;
}

export const productStockService = {
  // Lấy tất cả products từ database
  async getAllProducts(): Promise<Product[]> {
    try {
      const productsRef = ref(database, PRODUCTS_REF);
      const snapshot = await get(productsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Lấy tồn kho của một sản phẩm theo originalProductId
  async getProductStockByInventoryId(inventoryId: string): Promise<{
    totalStock: number;
    variants: Array<{
      size: string;
      stockQty: number;
      price: number;
    }>;
  } | null> {
    try {
      const products = await this.getAllProducts();
      const product = products.find((p) => p.originalProductId === inventoryId);

      if (!product) {
        return null;
      }

      const totalStock = product.variants.reduce(
        (total, variant) => total + variant.stockQty,
        0
      );

      return {
        totalStock,
        variants: product.variants.map((variant) => ({
          size: variant.size,
          stockQty: variant.stockQty,
          price: variant.price,
        })),
      };
    } catch (error) {
      console.error("Error getting product stock:", error);
      throw error;
    }
  },

  // Lấy tồn kho của tất cả sản phẩm có originalProductId
  async getAllProductStocks(): Promise<
    Map<
      string,
      {
        totalStock: number;
        variants: Array<{
          size: string;
          stockQty: number;
          price: number;
        }>;
      }
    >
  > {
    try {
      const products = await this.getAllProducts();
      const stockMap = new Map();

      products.forEach((product) => {
        if (product.originalProductId) {
          const totalStock = product.variants.reduce(
            (total, variant) => total + variant.stockQty,
            0
          );

          stockMap.set(product.originalProductId, {
            totalStock,
            variants: product.variants.map((variant) => ({
              size: variant.size,
              stockQty: variant.stockQty,
              price: variant.price,
            })),
          });
        }
      });

      return stockMap;
    } catch (error) {
      console.error("Error getting all product stocks:", error);
      throw error;
    }
  },

  // Lấy thống kê tồn kho từ products
  async getStockStatsFromProducts(): Promise<{
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
    inStock: number;
    productsWithStock: Array<{
      inventoryId: string;
      productName: string;
      totalStock: number;
      variants: Array<{
        size: string;
        stockQty: number;
      }>;
    }>;
  }> {
    try {
      const products = await this.getAllProducts();
      const productsWithStock = products
        .filter((p) => p.originalProductId)
        .map((product) => {
          const totalStock = product.variants.reduce(
            (total, variant) => total + variant.stockQty,
            0
          );
          return {
            inventoryId: product.originalProductId!,
            productName: product.name,
            totalStock,
            variants: product.variants.map((variant) => ({
              size: variant.size,
              stockQty: variant.stockQty,
            })),
          };
        });

      const totalProducts = productsWithStock.length;
      const outOfStock = productsWithStock.filter(
        (p) => p.totalStock === 0
      ).length;
      const lowStock = productsWithStock.filter(
        (p) => p.totalStock > 0 && p.totalStock <= 5
      ).length;
      const inStock = productsWithStock.filter((p) => p.totalStock > 5).length;

      return {
        totalProducts,
        outOfStock,
        lowStock,
        inStock,
        productsWithStock,
      };
    } catch (error) {
      console.error("Error getting stock stats from products:", error);
      throw error;
    }
  },
};
