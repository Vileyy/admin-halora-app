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
      <Text style={styles.emptyIcon}>📝</Text>
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
      {stats && (
        <View style={styles.statsSection}>
          <ReviewStatsComponent stats={stats} />
        </View>
      )}

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.filterTitle}>Danh sách đánh giá</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{reviews.length}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <Text style={styles.filterButtonText}>🔍</Text>
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
        </View>

        {hasActiveFilters && (
          <View style={styles.activeFiltersContainer}>
            <View style={styles.activeFiltersInfo}>
              <Text style={styles.activeFiltersIcon}>🔽</Text>
              <Text style={styles.activeFiltersText}>
                Bộ lọc đang hoạt động
              </Text>
            </View>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={onClearFilters}
            >
              <Text style={styles.clearFiltersText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
          colors={["#6C5CE7"]}
          tintColor="#6C5CE7"
          title="Đang tải đánh giá..."
          titleColor="#6C5CE7"
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
  statsSection: {
    marginBottom: 8,
  },
  filterSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(108, 92, 231, 0.1)",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2E3A59",
    marginRight: 12,
  },
  countBadge: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  countText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "#E4E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 18,
  },
  filterIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF4757",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#FF4757",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  activeFiltersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F3F4",
  },
  activeFiltersInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  activeFiltersIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  activeFiltersText: {
    fontSize: 15,
    color: "#8F9BB3",
    fontWeight: "600",
  },
  clearFiltersButton: {
    backgroundColor: "#FF4757",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#8F9BB3",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    color: "#8F9BB3",
    fontWeight: "500",
  },
});

export default ReviewList;
