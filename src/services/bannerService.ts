import { database } from "./firebase";
import { ref, get, push, update, remove } from "firebase/database";
import { Banner, CreateBannerData, UpdateBannerData } from "../types/banner";

const BANNERS_REF = "banners";

export const bannerService = {
  // Lấy tất cả banners
  async getAllBanners(): Promise<Banner[]> {
    try {
      const bannersRef = ref(database, BANNERS_REF);
      const snapshot = await get(bannersRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching banners:", error);
      throw error;
    }
  },

  // Lấy banner theo ID
  async getBannerById(id: string): Promise<Banner | null> {
    try {
      const bannerRef = ref(database, `${BANNERS_REF}/${id}`);
      const snapshot = await get(bannerRef);

      if (snapshot.exists()) {
        return {
          id,
          ...snapshot.val(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching banner:", error);
      throw error;
    }
  },

  // Tạo banner mới
  async createBanner(bannerData: CreateBannerData): Promise<string> {
    try {
      const bannersRef = ref(database, BANNERS_REF);
      const now = Date.now();
      const newBannerRef = await push(bannersRef, {
        ...bannerData,
        createdAt: now,
        updatedAt: now,
      });

      return newBannerRef.key!;
    } catch (error) {
      console.error("Error creating banner:", error);
      throw error;
    }
  },

  // Cập nhật banner
  async updateBanner(id: string, bannerData: UpdateBannerData): Promise<void> {
    try {
      const bannerRef = ref(database, `${BANNERS_REF}/${id}`);
      await update(bannerRef, {
        ...bannerData,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  },

  // Xóa banner
  async deleteBanner(id: string): Promise<void> {
    try {
      const bannerRef = ref(database, `${BANNERS_REF}/${id}`);
      await remove(bannerRef);
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  },
};
