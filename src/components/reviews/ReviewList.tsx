import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Review, ReviewStats } from "../../types/review";
import ReviewCard from "./ReviewCard";
import ReviewStatsComponent from "./ReviewStats";
import { Ionicons } from "@expo/vector-icons";

interface ReviewListProps {
  reviews: Review[];
  stats?: ReviewStats | null;
  loading: boolean;
  onRefresh: () => void;
  onDelete: (reviewId: string) => void;
  onViewProduct?: (productId: string) => void;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  stats,
  loading,
  onRefresh,
  onDelete,
  onViewProduct,
  onFilterPress,
  hasActiveFilters,
  onClearFilters,
}) => {
  const renderReview = ({ item }: { item: Review }) => (
    <ReviewCard
      review={item}
      onDelete={onDelete}
      onViewProduct={onViewProduct}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>Chưa có đánh giá nào</Text>
      <Text style={styles.emptyText}>
        {hasActiveFilters
          ? "Không tìm thấy đánh giá nào phù hợp với bộ lọc"
          : "Các đánh giá từ khách hàng sẽ hiển thị tại đây"}
      </Text>
      {hasActiveFilters && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={onClearFilters}
        >
          <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Stats Section */}
      {stats && <ReviewStatsComponent stats={stats} />}

      {/* Active Filter Badge */}
      {hasActiveFilters && (
        <View style={styles.activeFilterBadge}>
          <Ionicons name="funnel" size={14} color="#F59E0B" />
          <Text style={styles.activeFilterText}>Bộ lọc đang hoạt động</Text>
          <TouchableOpacity
            onPress={onClearFilters}
            style={styles.clearFilterButton}
          >
            <Ionicons name="close-circle" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (reviews.length === 0) return null;

    return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          {reviews.length > 10
            ? `Đã hiển thị ${reviews.length} đánh giá`
            : "Tất cả đánh giá đã được hiển thị"}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={reviews}
      renderItem={renderReview}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          colors={["#F59E0B"]}
          tintColor="#F59E0B"
        />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        reviews.length === 0 && styles.emptyListContainer,
      ]}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      getItemLayout={(data, index) => ({
        length: 280, // Estimated item height
        offset: 280 * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: "#F8FAFC",
  },
  activeFilterBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  activeFilterText: {
    flex: 1,
    fontSize: 14,
    color: "#D97706",
    fontWeight: "600",
  },
  clearFilterButton: {
    padding: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});

export default ReviewList;
