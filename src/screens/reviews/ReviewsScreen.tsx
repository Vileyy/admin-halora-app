import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
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
  const scrollY = new Animated.Value(0);

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

  const getHeaderGradient = (): [string, string] => {
    if (!stats) return ["#667eea", "#764ba2"];

    if (stats.averageRating >= 4) return ["#56ab2f", "#a8e6cf"];
    if (stats.averageRating >= 3) return ["#f093fb", "#f5576c"];
    return ["#ff6b6b", "#ee5a24"];
  };

  const getStatsCards = () => {
    if (!stats) return [];

    return [
      {
        icon: "⭐",
        value: stats.averageRating.toFixed(1),
        label: "Đánh giá TB",
        color: "#FFD700",
        bg: "rgba(255, 215, 0, 0.1)",
      },
      {
        icon: "🚚",
        value: stats.averageShippingRating.toFixed(1),
        label: "Vận chuyển",
        color: "#00B894",
        bg: "rgba(0, 184, 148, 0.1)",
      },
      {
        icon: "👥",
        value: stats.totalReviews.toString(),
        label: "Tổng đánh giá",
        color: "#6C5CE7",
        bg: "rgba(108, 92, 231, 0.1)",
      },
      {
        icon: "😊",
        value: `${
          stats.totalReviews > 0
            ? Math.round(
                (((stats.ratingBreakdown[5] || 0) +
                  (stats.ratingBreakdown[4] || 0)) /
                  stats.totalReviews) *
                  100
              )
            : 0
        }%`,
        label: "Hài lòng",
        color: "#00D4AA",
        bg: "rgba(0, 212, 170, 0.1)",
      },
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={getHeaderGradient()[0]}
      />

      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={getHeaderGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              hasActiveFilters && styles.filterActiveButton,
            ]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={styles.filterButtonText}>🔍</Text>
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Header Content */}
        <View style={styles.headerContent}>
          <Text style={styles.title}>Quản lý đánh giá</Text>
          <Text style={styles.subtitle}>{getHeaderSubtitle()}</Text>

          {/* Quick Stats Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statsScrollView}
            contentContainerStyle={styles.statsContainer}
          >
            {getStatsCards().map((stat, index) => (
              <View
                key={index}
                style={[styles.statCard, { backgroundColor: stat.bg }]}
              >
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Content Area */}
      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.contentContainer}>
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
      </Animated.ScrollView>

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
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  filterActiveButton: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  filterButtonText: {
    fontSize: 20,
  },
  filterIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
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
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  statsScrollView: {
    maxHeight: 120,
  },
  statsContainer: {
    paddingHorizontal: 4,
    gap: 16,
  },
  statCard: {
    minWidth: 120,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  contentContainer: {
    paddingTop: 20,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default ReviewsScreen;
