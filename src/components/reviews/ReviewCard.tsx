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
import { Ionicons } from "@expo/vector-icons";

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color={index < rating ? "#F59E0B" : "#D1D5DB"}
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

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
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
          <View style={styles.orderInfo}>
            <Ionicons name="receipt-outline" size={12} color="#6B7280" />
            <Text style={styles.orderId}>{review.orderId}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Ratings */}
      <View style={styles.ratingsSection}>
        <View style={styles.ratingRow}>
          <View style={styles.ratingLabel}>
            <Ionicons name="cube-outline" size={16} color="#6B7280" />
            <Text style={styles.ratingLabelText}>Sản phẩm</Text>
          </View>
          <View style={styles.ratingStars}>
            {renderStars(review.rating)}
            <Text style={styles.ratingValue}>{review.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.ratingLabel}>
            <Ionicons name="car-outline" size={16} color="#6B7280" />
            <Text style={styles.ratingLabelText}>Vận chuyển</Text>
          </View>
          <View style={styles.ratingStars}>
            {renderStars(review.shippingRating)}
            <Text style={styles.ratingValue}>
              {review.shippingRating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Comment */}
      {review.comment && (
        <View style={styles.commentSection}>
          <View style={styles.commentHeader}>
            <Ionicons name="chatbox-outline" size={16} color="#6B7280" />
            <Text style={styles.commentHeaderText}>Nhận xét</Text>
          </View>
          <Text style={styles.commentText}>{review.comment}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.timeText}>
          {new Date(review.createdAt).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
        {review.createdAt !== review.updatedAt && (
          <View style={styles.editedBadge}>
            <Text style={styles.editedText}>Đã chỉnh sửa</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  productSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#F3F4F6",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 20,
    marginBottom: 6,
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  orderId: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  ratingsSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  ratingLabelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    marginLeft: 4,
  },
  commentSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  commentHeaderText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  timeText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  editedBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  editedText: {
    fontSize: 11,
    color: "#D97706",
    fontWeight: "600",
  },
});

export default ReviewCard;
