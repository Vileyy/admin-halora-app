import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ReviewStats } from "../../types/review";
import { Ionicons } from "@expo/vector-icons";

interface ReviewStatsComponentProps {
  stats: ReviewStats;
}

const ReviewStatsComponent: React.FC<ReviewStatsComponentProps> = ({
  stats,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={14}
        color={index < rating ? "#F59E0B" : "#D1D5DB"}
      />
    ));
  };

  const getProgressWidth = (count: number) => {
    if (stats.totalReviews === 0) return 0;
    const percentage = (count / stats.totalReviews) * 100;
    // Đảm bảo progress bar có ít nhất 3% width để hiển thị đẹp
    return Math.max(percentage, count > 0 ? 3 : 0);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#10B981";
    if (rating >= 3) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <View style={styles.container}>
      {/* Main Stats */}
      <View style={styles.mainStats}>
        <View style={styles.statCard}>
          <Ionicons name="star" size={24} color="#F59E0B" />
          <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {renderStars(stats.averageRating)}
          </View>
          <Text style={styles.statLabel}>Sản phẩm</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="car" size={24} color="#10B981" />
          <Text style={styles.statValue}>
            {stats.averageShippingRating.toFixed(1)}
          </Text>
          <View style={styles.starsContainer}>
            {renderStars(stats.averageShippingRating)}
          </View>
          <Text style={styles.statLabel}>Vận chuyển</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#8B5CF6" />
          <Text style={styles.statValue}>{stats.totalReviews}</Text>
          <Text style={styles.statLabel}>Tổng đánh giá</Text>
        </View>
      </View>

      {/* Rating Breakdown */}
      <View style={styles.breakdownSection}>
        <Text style={styles.breakdownTitle}>Phân tích đánh giá</Text>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingBreakdown[rating] || 0;
          const percentage =
            stats.totalReviews > 0
              ? ((count / stats.totalReviews) * 100).toFixed(0)
              : 0;

          return (
            <View key={rating} style={styles.breakdownItem}>
              <Text style={styles.ratingNumber}>{rating}</Text>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressWidth(count)}%`,
                      backgroundColor: getRatingColor(rating),
                    },
                  ]}
                />
              </View>
              <Text style={styles.percentageText}>{percentage}%</Text>
              <Text style={styles.countText}>({count})</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
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
  mainStats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  breakdownSection: {
    gap: 10,
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    width: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    width: 36,
    textAlign: "right",
  },
  countText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    width: 32,
  },
});

export default ReviewStatsComponent;
