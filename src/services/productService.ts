import { HaloraDatabaseService } from "./database";
import { Product, ProductFormData, ProductFilters } from "../types/product";

export class ProductService {
  // Get all products
  static async getAllProducts(): Promise<{
    success: boolean;
    data?: Product[];
    error?: string;
  }> {
    try {
      const result = await HaloraDatabaseService.getProducts();
      if (result.success && result.data) {
        const products: Product[] = Object.entries(result.data).map(
          ([id, product]: [string, any]) => ({
            id,
            title: product.name,
            description: product.description,
            category:
              product.category === "FlashDeals"
                ? "Flash Deal"
                : product.category === "new_product"
                ? "Sản phẩm mới"
                : product.category,
            brand: product.brand || "Unknown",
            imageUrl: product.image,
            variants:
              product.variants?.map((variant: any, index: number) => ({
                id: `${id}_variant_${index}`,
                size: variant.size,
                price: variant.price,
                stock: variant.stockQty || variant.stock || 0,
                sku: variant.sku,
              })) || [],
            isFlashDeal: product.category === "FlashDeals",
            flashDealEndTime: product.flashDealEndTime,
            createdAt: product.createdAt || Date.now(),
            updatedAt: product.updatedAt || Date.now(),
          })
        );
        return { success: true, data: products };
      }
      return { success: true, data: [] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get products with filters
  static async getProductsWithFilters(
    filters: ProductFilters
  ): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
      const result = await this.getAllProducts();
      if (!result.success || !result.data) {
        return result;
      }

      let filteredProducts = result.data;

      // Filter by category
      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === filters.category
        );
      }

      // Filter by brand
      if (filters.brand) {
        filteredProducts = filteredProducts.filter(
          (p) => p.brand === filters.brand
        );
      }

      // Filter by price range
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter((p) => {
          if (!p.variants || p.variants.length === 0) return false;

          const minPrice = Math.min(...p.variants.map((v) => v.price));
          const maxPrice = Math.max(...p.variants.map((v) => v.price));

          if (filters.minPrice !== undefined && maxPrice < filters.minPrice)
            return false;
          if (filters.maxPrice !== undefined && minPrice > filters.maxPrice)
            return false;

          return true;
        });
      }

      // Filter by stock availability
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter((p) => {
          if (!p.variants || p.variants.length === 0) return false;
          return p.variants.some((v) => v.stock > 0);
        });
      }

      return { success: true, data: filteredProducts };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get flash deals
  static async getFlashDeals(): Promise<{
    success: boolean;
    data?: Product[];
    error?: string;
  }> {
    try {
      const result = await this.getAllProducts();
      if (!result.success || !result.data) {
        return result;
      }

      const flashDeals = result.data.filter((p) => p.isFlashDeal);

      return { success: true, data: flashDeals };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get new products (created within last 30 days)
  static async getNewProducts(
    limit: number = 20
  ): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
      const result = await this.getAllProducts();
      if (!result.success || !result.data) {
        return result;
      }

      const newProducts = result.data
        .filter((p) => p.category === "Sản phẩm mới")
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);

      return { success: true, data: newProducts };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get product by ID
  static async getProductById(
    productId: string
  ): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
      const result = await HaloraDatabaseService.getProducts();
      if (!result.success || !result.data) {
        return { success: false, error: "Product not found" };
      }

      const product = result.data[productId];
      if (!product) {
        return { success: false, error: "Product not found" };
      }

      return {
        success: true,
        data: {
          id: productId,
          ...product,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Add new product
  static async addProduct(
    productData: ProductFormData
  ): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
    try {
      const result = await HaloraDatabaseService.addProduct(productData);
      if (result.success) {
        return { success: true, data: { id: result.key || "" } };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Update product
  static async updateProduct(
    productId: string,
    updates: Partial<ProductFormData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await HaloraDatabaseService.updateProduct(
        productId,
        updates
      );
      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Delete product
  static async deleteProduct(
    productId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await HaloraDatabaseService.deleteProduct(productId);
      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Search products
  static async searchProducts(
    query: string
  ): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
      const result = await this.getAllProducts();
      if (!result.success || !result.data) {
        return result;
      }

      const searchQuery = query.toLowerCase();
      const searchResults = result.data.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery) ||
          p.brand.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery)
      );

      return { success: true, data: searchResults };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get products by category
  static async getProductsByCategory(
    category: string
  ): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    return this.getProductsWithFilters({ category });
  }

  // Get products by brand
  static async getProductsByBrand(
    brand: string
  ): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    return this.getProductsWithFilters({ brand });
  }

  // Get low stock products (stock < threshold)
  static async getLowStockProducts(
    threshold: number = 10
  ): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
      const result = await this.getAllProducts();
      if (!result.success || !result.data) {
        return result;
      }

      const lowStockProducts = result.data.filter((p) => {
        if (!p.variants || p.variants.length === 0) return false;
        const totalStock = p.variants.reduce(
          (total, variant) => total + variant.stock,
          0
        );
        return totalStock < threshold;
      });

      return { success: true, data: lowStockProducts };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get product statistics
  static async getProductStats(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const result = await this.getAllProducts();
      if (!result.success || !result.data) {
        return result;
      }

      const products = result.data;
      const totalProducts = products.length;
      const flashDeals = products.filter((p) => p.isFlashDeal).length;
      const newProducts = products.filter((p) => {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return p.createdAt > oneWeekAgo;
      }).length;

      const categoryStats = products.reduce((acc: any, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});

      const brandStats = products.reduce((acc: any, product) => {
        acc[product.brand] = (acc[product.brand] || 0) + 1;
        return acc;
      }, {});

      const totalStock = products.reduce((total, product) => {
        if (!product.variants) return total;
        return (
          total +
          product.variants.reduce((sum, variant) => sum + variant.stock, 0)
        );
      }, 0);

      return {
        success: true,
        data: {
          totalProducts,
          flashDeals,
          newProducts,
          categoryStats,
          brandStats,
          totalStock,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
