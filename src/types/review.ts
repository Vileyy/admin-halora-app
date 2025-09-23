export interface Review {
  id: string;
  comment: string;
  rating: number;
  shippingRating: number;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  averageShippingRating: number;
  ratingBreakdown: {
    [key: number]: number; // rating (1-5) -> count
  };
}

export interface ReviewFilters {
  rating?: number;
  productId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}
