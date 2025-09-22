import { database } from "./firebase";
import { ref, get, push, update, remove, child } from "firebase/database";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../types/category";

const CATEGORIES_REF = "categories";

export const categoryService = {
  // Lấy tất cả categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const categoriesRef = ref(database, CATEGORIES_REF);
      const snapshot = await get(categoriesRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Lấy category theo ID
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const categoryRef = ref(database, `${CATEGORIES_REF}/${id}`);
      const snapshot = await get(categoryRef);

      if (snapshot.exists()) {
        return {
          id,
          ...snapshot.val(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  // Tạo category mới
  async createCategory(categoryData: CreateCategoryData): Promise<string> {
    try {
      const categoriesRef = ref(database, CATEGORIES_REF);
      const newCategoryRef = await push(categoriesRef, {
        ...categoryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return newCategoryRef.key!;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Cập nhật category
  async updateCategory(
    id: string,
    categoryData: UpdateCategoryData
  ): Promise<void> {
    try {
      const categoryRef = ref(database, `${CATEGORIES_REF}/${id}`);
      await update(categoryRef, {
        ...categoryData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Xóa category
  async deleteCategory(id: string): Promise<void> {
    try {
      const categoryRef = ref(database, `${CATEGORIES_REF}/${id}`);
      await remove(categoryRef);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
