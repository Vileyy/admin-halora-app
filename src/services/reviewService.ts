import { database } from "./firebase";
import {
  ref,
  get,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { Review, ReviewStats, ReviewFilters } from "../types/review";

const REVIEWS_REF = "reviews";

export const reviewService = {
  // Lấy tất cả reviews
  async getAllReviews(): Promise<Review[]> {
    try {
      const reviewsRef = ref(database, REVIEWS_REF);
      const snapshot = await get(reviewsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
      return [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  // Lấy review theo ID
  async getReviewById(id: string): Promise<Review | null> {
    try {
      const reviewRef = ref(database, `${REVIEWS_REF}/${id}`);
      const snapshot = await get(reviewRef);

      if (snapshot.exists()) {
        return {
          id,
          ...snapshot.val(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching review:", error);
      throw error;
    }
  },

  // Lấy reviews theo productId
  async getReviewsByProductId(productId: string): Promise<Review[]> {
    try {
      const reviewsRef = ref(database, REVIEWS_REF);
      const reviewQuery = query(
        reviewsRef,
        orderByChild("productId"),
        equalTo(productId)
      );
      const snapshot = await get(reviewQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
      return [];
    } catch (error) {
      console.error("Error fetching reviews by product:", error);
      throw error;
    }
  },

  // Lấy reviews theo userId
  async getReviewsByUserId(userId: string): Promise<Review[]> {
    try {
      const reviewsRef = ref(database, REVIEWS_REF);
      const reviewQuery = query(
        reviewsRef,
        orderByChild("userId"),
        equalTo(userId)
      );
      const snapshot = await get(reviewQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
      return [];
    } catch (error) {
      console.error("Error fetching reviews by user:", error);
      throw error;
    }
  },

  // Xóa review
  async deleteReview(id: string): Promise<void> {
    try {
      const reviewRef = ref(database, `${REVIEWS_REF}/${id}`);
      await remove(reviewRef);
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  // Tính toán thống kê reviews
  async getReviewStats(): Promise<ReviewStats> {
    try {
      const reviews = await this.getAllReviews();

      if (reviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          averageShippingRating: 0,
          ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const totalShippingRating = reviews.reduce(
        (sum, review) => sum + review.shippingRating,
        0
      );

      const ratingBreakdown = reviews.reduce((breakdown, review) => {
        breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
        return breakdown;
      }, {} as { [key: number]: number });

      // Đảm bảo có đầy đủ các rating từ 1-5
      for (let i = 1; i <= 5; i++) {
        if (!ratingBreakdown[i]) ratingBreakdown[i] = 0;
      }

      return {
        totalReviews: reviews.length,
        averageRating: Math.round((totalRating / reviews.length) * 10) / 10,
        averageShippingRating:
          Math.round((totalShippingRating / reviews.length) * 10) / 10,
        ratingBreakdown,
      };
    } catch (error) {
      console.error("Error calculating review stats:", error);
      throw error;
    }
  },

  // Lọc reviews
  filterReviews(reviews: Review[], filters: ReviewFilters): Review[] {
    return reviews.filter((review) => {
      if (filters.rating && review.rating !== filters.rating) return false;
      if (filters.productId && review.productId !== filters.productId)
        return false;
      if (filters.userId && review.userId !== filters.userId) return false;
      if (
        filters.dateFrom &&
        new Date(review.createdAt) < new Date(filters.dateFrom)
      )
        return false;
      if (
        filters.dateTo &&
        new Date(review.createdAt) > new Date(filters.dateTo)
      )
        return false;
      return true;
    });
  },
};
