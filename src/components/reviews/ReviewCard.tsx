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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F1F3F4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6C5CE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 13,
    color: "#8F9BB3",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  productSection: {
    flexDirection: "row",
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E3A59",
    lineHeight: 22,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 13,
    color: "#8F9BB3",
    marginBottom: 8,
  },
  productActions: {
    alignSelf: "flex-start",
  },
  viewProductText: {
    fontSize: 13,
    color: "#6C5CE7",
    fontWeight: "600",
  },
  ratingsDetail: {
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  ratingItem: {
    gap: 8,
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E3A59",
  },
  ratingStatus: {
    fontSize: 13,
    fontWeight: "700",
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
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#6C5CE7",
  },
  commentText: {
    fontSize: 15,
    color: "#2E3A59",
    lineHeight: 24,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F3F4",
  },
  footerLeft: {
    flex: 1,
  },
  footerText: {
    fontSize: 12,
    color: "#8F9BB3",
    fontStyle: "italic",
  },
  footerRight: {},
  timeText: {
    fontSize: 12,
    color: "#8F9BB3",
    fontWeight: "500",
  },
});

export default ReviewCard;
