import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Review } from "../../types/review";
import { TrashIcon, StarIcon, UserIcon } from "../common/icons";

interface ReviewCardProps {
  review: Review;
  onDelete: (reviewId: string) => void;
  onViewProduct?: (productId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onDelete,
  onViewProduct,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Xóa đánh giá",
      `Bạn có chắc chắn muốn xóa đánh giá của ${review.userName}?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => onDelete(review.id),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hôm nay";
    } else if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        size={size}
        color={index < rating ? "#FFD700" : "#E4E6EA"}
        filled={index < rating}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#00B894";
    if (rating >= 3) return "#FDCB6E";
    return "#FF6B6B";
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4) return "Tuyệt vời";
    if (rating >= 3) return "Tốt";
    if (rating >= 2) return "Trung bình";
    return "Kém";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {review.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.reviewDate}>
              {formatDate(review.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <View
            style={[
              styles.ratingBadge,
              { backgroundColor: getRatingColor(review.rating) + "20" },
            ]}
          >
            <StarIcon size={12} color={getRatingColor(review.rating)} filled />
            <Text
              style={[
                styles.ratingText,
                { color: getRatingColor(review.rating) },
              ]}
            >
              {review.rating}/5
            </Text>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <TrashIcon size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Section */}
      <TouchableOpacity
        style={styles.productSection}
        onPress={() => onViewProduct?.(review.productId)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: review.productImage }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {review.productName}
          </Text>
          <Text style={styles.orderId}>Đơn hàng: {review.orderId}</Text>
          <View style={styles.productActions}>
            <Text style={styles.viewProductText}>Xem sản phẩm →</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Ratings Detail */}
      <View style={styles.ratingsDetail}>
        <View style={styles.ratingItem}>
          <View style={styles.ratingHeader}>
            <Text style={styles.ratingLabel}>Chất lượng sản phẩm</Text>
            <Text
              style={[
                styles.ratingStatus,
                { color: getRatingColor(review.rating) },
              ]}
            >
              {getRatingText(review.rating)}
            </Text>
          </View>
          <View style={styles.starsRow}>
            <View style={styles.starsContainer}>
              {renderStars(review.rating, 18)}
            </View>
            <Text style={styles.ratingValue}>({review.rating}/5)</Text>
          </View>
        </View>

        <View style={styles.ratingItem}>
          <View style={styles.ratingHeader}>
            <Text style={styles.ratingLabel}>Dịch vụ vận chuyển</Text>
            <Text
              style={[
                styles.ratingStatus,
                { color: getRatingColor(review.shippingRating) },
              ]}
            >
              {getRatingText(review.shippingRating)}
            </Text>
          </View>
          <View style={styles.starsRow}>
            <View style={styles.starsContainer}>
              {renderStars(review.shippingRating, 18)}
            </View>
            <Text style={styles.ratingValue}>({review.shippingRating}/5)</Text>
          </View>
        </View>
      </View>

      {/* Comment */}
      <View style={styles.commentSection}>
        <Text style={styles.commentText}>"{review.comment}"</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerText}>
            {review.createdAt !== review.updatedAt ? "Đã chỉnh sửa" : ""}
          </Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.timeText}>
            {new Date(review.createdAt).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(108, 92, 231, 0.08)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#6C5CE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2E3A59",
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 14,
    color: "#8F9BB3",
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "800",
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE5E5",
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productSection: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  productImage: {
    width: 88,
    height: 88,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E3A59",
    lineHeight: 24,
    marginBottom: 6,
  },
  orderId: {
    fontSize: 14,
    color: "#8F9BB3",
    marginBottom: 10,
    fontWeight: "600",
  },
  productActions: {
    alignSelf: "flex-start",
  },
  viewProductText: {
    fontSize: 14,
    color: "#6C5CE7",
    fontWeight: "700",
  },
  ratingsDetail: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  ratingItem: {
    gap: 10,
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2E3A59",
  },
  ratingStatus: {
    fontSize: 14,
    fontWeight: "800",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  ratingValue: {
    fontSize: 13,
    color: "#8F9BB3",
    fontWeight: "600",
  },
  commentSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#6C5CE7",
    borderWidth: 1,
    borderColor: "#E4E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  commentText: {
    fontSize: 16,
    color: "#2E3A59",
    lineHeight: 26,
    fontStyle: "italic",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E4E7EB",
  },
  footerLeft: {
    flex: 1,
  },
  footerText: {
    fontSize: 13,
    color: "#8F9BB3",
    fontStyle: "italic",
    fontWeight: "600",
  },
  footerRight: {},
  timeText: {
    fontSize: 13,
    color: "#8F9BB3",
    fontWeight: "700",
  },
});

export default ReviewCard;
