import { database } from "./firebase";
import { ref, get, push, update, remove } from "firebase/database";
import { Brand, CreateBrandData, UpdateBrandData } from "../types/brand";

const BRANDS_REF = "brands";

export const brandService = {
  // Lấy tất cả brands
  async getAllBrands(): Promise<Brand[]> {
    try {
      const brandsRef = ref(database, BRANDS_REF);
      const snapshot = await get(brandsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  },

  // Lấy brand theo ID
  async getBrandById(id: string): Promise<Brand | null> {
    try {
      const brandRef = ref(database, `${BRANDS_REF}/${id}`);
      const snapshot = await get(brandRef);

      if (snapshot.exists()) {
        return {
          id,
          ...snapshot.val(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching brand:", error);
      throw error;
    }
  },

  // Tạo brand mới
  async createBrand(brandData: CreateBrandData): Promise<string> {
    try {
      const brandsRef = ref(database, BRANDS_REF);
      const newBrandRef = await push(brandsRef, {
        ...brandData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return newBrandRef.key!;
    } catch (error) {
      console.error("Error creating brand:", error);
      throw error;
    }
  },

  // Cập nhật brand
  async updateBrand(id: string, brandData: UpdateBrandData): Promise<void> {
    try {
      const brandRef = ref(database, `${BRANDS_REF}/${id}`);
      await update(brandRef, {
        ...brandData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating brand:", error);
      throw error;
    }
  },

  // Xóa brand
  async deleteBrand(id: string): Promise<void> {
    try {
      const brandRef = ref(database, `${BRANDS_REF}/${id}`);
      await remove(brandRef);
    } catch (error) {
      console.error("Error deleting brand:", error);
      throw error;
    }
  },
};
