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
import { Ionicons } from "@expo/vector-icons";

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title}>Đánh giá sản phẩm</Text>
            <View style={styles.reviewCount}>
              <Ionicons name="star-outline" size={14} color="#6B7280" />
              <Text style={styles.subtitle}>
                {filteredReviews.length} đánh giá
                {hasActiveFilters && " (đã lọc)"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.filterButton,
              hasActiveFilters && styles.filterButtonActive,
            ]}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="filter"
              size={20}
              color={hasActiveFilters ? "#FFFFFF" : "#F59E0B"}
            />
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Review List - Using FlatList directly, no wrapping ScrollView */}
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
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  reviewCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: "#F59E0B",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  filterIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

export default ReviewsScreen;
