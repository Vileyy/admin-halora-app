import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ReviewStats } from "../../types/review";
import { StarIcon } from "../common/icons";

interface ReviewStatsComponentProps {
  stats: ReviewStats;
}

const ReviewStatsComponent: React.FC<ReviewStatsComponentProps> = ({
  stats,
}) => {
  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text
        key={index}
        style={[
          styles.star,
          {
            fontSize: size,
            color: index < rating ? "#FFD700" : "#E4E6EA",
          },
        ]}
      >
        ★
      </Text>
    ));
  };

  const getProgressWidth = (count: number) => {
    if (stats.totalReviews === 0) return 0;
    const percentage = (count / stats.totalReviews) * 100;
    // Đảm bảo progress bar có ít nhất 3% width để hiển thị đẹp
    return Math.max(percentage, count > 0 ? 3 : 0);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#00B894";
    if (rating >= 3) return "#FDCB6E";
    return "#FF6B6B";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Thống kê đánh giá</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{stats.totalReviews} đánh giá</Text>
        </View>
      </View>

      {/* Main Stats */}
      <View style={styles.mainStats}>
        {/* Average Rating */}
        <View style={styles.averageSection}>
          <View style={styles.ratingDisplay}>
            <Text
              style={[
                styles.averageRating,
                { color: getRatingColor(stats.averageRating) },
              ]}
            >
              {stats.averageRating.toFixed(1)}
            </Text>
            <View style={styles.starsContainer}>
              {renderStars(stats.averageRating, 24)}
            </View>
            <Text style={styles.ratingLabel}>Chất lượng sản phẩm</Text>
          </View>
        </View>

        {/* Shipping Rating */}
        <View style={styles.shippingSection}>
          <View style={styles.ratingDisplay}>
            <Text
              style={[
                styles.averageRating,
                { color: getRatingColor(stats.averageShippingRating) },
              ]}
            >
              {stats.averageShippingRating.toFixed(1)}
            </Text>
            <View style={styles.starsContainer}>
              {renderStars(stats.averageShippingRating, 24)}
            </View>
            <Text style={styles.ratingLabel}>Dịch vụ vận chuyển</Text>
          </View>
        </View>
      </View>

      {/* Rating Breakdown */}
      <View style={styles.breakdownSection}>
        <Text style={styles.breakdownTitle}>Phân tích chi tiết</Text>
        <View style={styles.breakdownList}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingBreakdown[rating] || 0;
            const percentage =
              stats.totalReviews > 0
                ? ((count / stats.totalReviews) * 100).toFixed(1)
                : 0;

            return (
              <View key={rating} style={styles.breakdownItem}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.ratingNumber}>{rating}</Text>
                  <View style={styles.ratingStars}>
                    {renderStars(rating, 14)}
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${getProgressWidth(count)}%`,
                          backgroundColor: getRatingColor(rating),
                        },
                      ]}
                    />
                    {count > 0 && getProgressWidth(count) <= 5 && (
                      <View
                        style={[
                          styles.lowPercentageIndicator,
                          { backgroundColor: getRatingColor(rating) },
                        ]}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.breakdownRight}>
                  <Text style={styles.countText}>{count}</Text>
                  <Text style={styles.percentageText}>({percentage}%)</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, { backgroundColor: "#E8F5E8" }]}>
          <Text style={styles.summaryNumber}>
            {(stats.ratingBreakdown[5] || 0) + (stats.ratingBreakdown[4] || 0)}
          </Text>
          <Text style={styles.summaryLabel}>Đánh giá tích cực</Text>
          <Text style={[styles.summaryPercentage, { color: "#00B894" }]}>
            {stats.totalReviews > 0
              ? (
                  (((stats.ratingBreakdown[5] || 0) +
                    (stats.ratingBreakdown[4] || 0)) /
                    stats.totalReviews) *
                  100
                ).toFixed(1)
              : 0}
            %
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: "#FFF4E6" }]}>
          <Text style={styles.summaryNumber}>
            {stats.ratingBreakdown[3] || 0}
          </Text>
          <Text style={styles.summaryLabel}>Đánh giá trung bình</Text>
          <Text style={[styles.summaryPercentage, { color: "#FDCB6E" }]}>
            {stats.totalReviews > 0
              ? (
                  ((stats.ratingBreakdown[3] || 0) / stats.totalReviews) *
                  100
                ).toFixed(1)
              : 0}
            %
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: "#FFE8E8" }]}>
          <Text style={styles.summaryNumber}>
            {(stats.ratingBreakdown[2] || 0) + (stats.ratingBreakdown[1] || 0)}
          </Text>
          <Text style={styles.summaryLabel}>Đánh giá tiêu cực</Text>
          <Text style={[styles.summaryPercentage, { color: "#FF6B6B" }]}>
            {stats.totalReviews > 0
              ? (
                  (((stats.ratingBreakdown[2] || 0) +
                    (stats.ratingBreakdown[1] || 0)) /
                    stats.totalReviews) *
                  100
                ).toFixed(1)
              : 0}
            %
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(108, 92, 231, 0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2E3A59",
    letterSpacing: 0.5,
  },
  totalBadge: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  totalText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  mainStats: {
    flexDirection: "row",
    marginBottom: 28,
    gap: 20,
  },
  averageSection: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  shippingSection: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingDisplay: {
    alignItems: "center",
  },
  averageRating: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 3,
  },
  ratingLabel: {
    fontSize: 13,
    color: "#8F9BB3",
    fontWeight: "700",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  breakdownSection: {
    marginBottom: 28,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2E3A59",
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  breakdownList: {
    paddingVertical: 8,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 4,
  },
  breakdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    paddingRight: 8,
  },
  ratingStars: {
    flexDirection: "row",
    marginLeft: 12,
    gap: 3,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E3A59",
    width: 24,
    textAlign: "center",
  },
  star: {
    marginHorizontal: 0,
  },
  progressContainer: {
    flex: 1,
    height: 12,
    marginHorizontal: 16,
  },
  progressBackground: {
    flex: 1,
    backgroundColor: "#F1F3F4",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
    minWidth: 4,
  },
  lowPercentageIndicator: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 3,
    marginRight: 2,
  },
  breakdownRight: {
    flexDirection: "row",
    alignItems: "center",
    width: 90,
    justifyContent: "flex-end",
    gap: 8,
    paddingLeft: 8,
  },
  countText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2E3A59",
  },
  percentageText: {
    fontSize: 13,
    color: "#8F9BB3",
    fontWeight: "500",
  },
  summaryCards: {
    flexDirection: "row",
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: "#2E3A59",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#8F9BB3",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryPercentage: {
    fontSize: 16,
    fontWeight: "800",
  },
});

export default ReviewStatsComponent;
