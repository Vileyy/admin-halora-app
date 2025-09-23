import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchReviews,
  fetchReviewStats,
  deleteReview,
  setFilters,
  clearFilters,
  clearError,
} from "../../redux/slices/reviewSlice";
import { Review, ReviewFilters } from "../../types/review";
import { ReviewList, ReviewFilter } from "../../components/reviews";
import { ArrowLeftIcon } from "../../components/common/icons";

function ReviewsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { filteredReviews, stats, loading, error, filters } = useSelector(
    (state: RootState) => state.reviews
  );

  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchReviews());
    dispatch(fetchReviewStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([dispatch(fetchReviews()), dispatch(fetchReviewStats())]);
    setRefreshing(false);
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
      Alert.alert("Thành công", "Đánh giá đã được xóa");
      // Refresh stats after deletion
      dispatch(fetchReviewStats());
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa đánh giá");
    }
  };

  const handleViewProduct = (productId: string) => {
    // Navigate to product detail
    (navigation as any).navigate("ProductDetailScreen", { productId });
  };

  const handleApplyFilters = (newFilters: ReviewFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const getHeaderSubtitle = () => {
    if (hasActiveFilters) {
      return `${filteredReviews.length} đánh giá (đã lọc)`;
    }
    return `${filteredReviews.length} đánh giá`;
  };

  const getHeaderColor = () => {
    if (!stats) return "#6C5CE7";

    if (stats.averageRating >= 4) return "#00B894";
    if (stats.averageRating >= 3) return "#FDCB6E";
    return "#FF6B6B";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={getHeaderColor()} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: getHeaderColor() }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Quản lý đánh giá</Text>
          <Text style={styles.subtitle}>{getHeaderSubtitle()}</Text>
          {stats && (
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  ⭐ {stats.averageRating.toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>Trung bình</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  🚚 {stats.averageShippingRating.toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>Vận chuyển</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {stats.totalReviews > 0
                    ? Math.round(
                        (((stats.ratingBreakdown[5] || 0) +
                          (stats.ratingBreakdown[4] || 0)) /
                          stats.totalReviews) *
                          100
                      )
                    : 0}
                  %
                </Text>
                <Text style={styles.statLabel}>Hài lòng</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.filterHeaderButton,
              hasActiveFilters && styles.filterActiveButton,
            ]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={styles.filterHeaderButtonText}>🔍</Text>
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ReviewList
          reviews={filteredReviews}
          stats={stats}
          loading={loading || refreshing}
          onRefresh={handleRefresh}
          onDelete={handleDelete}
          onViewProduct={handleViewProduct}
          onFilterPress={() => setFilterModalVisible(true)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      </View>

      {/* Filter Modal */}
      <ReviewFilter
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  headerContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    marginBottom: 16,
  },
  quickStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 16,
  },
  headerActions: {
    position: "absolute",
    top: 16,
    right: 20,
  },
  filterHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterActiveButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  filterHeaderButtonText: {
    fontSize: 18,
  },
  filterIndicator: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF6B6B",
    borderWidth: 2,
    borderColor: "#fff",
  },
  content: {
    flex: 1,
    marginTop: -12,
  },
});

export default ReviewsScreen;
