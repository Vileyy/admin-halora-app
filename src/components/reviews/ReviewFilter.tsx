import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ReviewFilters } from "../../types/review";
import {
  ArrowLeftIcon,
  FilterIcon,
  CalendarIcon,
  SearchIcon,
} from "../common/icons";

interface ReviewFilterProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ReviewFilters) => void;
  currentFilters: ReviewFilters;
}

const { width } = Dimensions.get("window");

const ReviewFilter: React.FC<ReviewFilterProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<ReviewFilters>(currentFilters);
  const [slideAnim] = useState(new Animated.Value(width));
  const [overlayOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
  };

  const handleReset = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== ""
    ).length;
  };

  const ratingOptions = [
    {
      label: "Tất cả đánh giá",
      value: undefined,
      emoji: "⭐",
      color: "#8F9BB3",
    },
    { label: "Xuất sắc", value: 5, emoji: "🌟", color: "#00B894" },
    { label: "Rất tốt", value: 4, emoji: "😊", color: "#00D4AA" },
    { label: "Tốt", value: 3, emoji: "😐", color: "#FDCB6E" },
    { label: "Trung bình", value: 2, emoji: "😕", color: "#FF7675" },
    { label: "Kém", value: 1, emoji: "😞", color: "#FF6B6B" },
  ];

  const quickFilters = [
    {
      label: "Hôm nay",
      dateFrom: new Date().toISOString().split("T")[0],
      icon: "📅",
    },
    {
      label: "7 ngày qua",
      dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      icon: "📊",
    },
    {
      label: "30 ngày qua",
      dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      icon: "📈",
    },
    { label: "Đánh giá cao", rating: 5, icon: "⭐" },
    { label: "Đánh giá thấp", rating: 1, icon: "⚠️" },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text
        key={index}
        style={[styles.star, { color: index < rating ? "#FFD700" : "#E4E6EA" }]}
      >
        ★
      </Text>
    ));
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity
          style={styles.overlayTouch}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Filter Panel */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <LinearGradient
          colors={["#6C5CE7", "#74b9ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <ArrowLeftIcon size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title}>Bộ lọc đánh giá</Text>
            <Text style={styles.subtitle}>
              {getActiveFiltersCount() > 0
                ? `${getActiveFiltersCount()} bộ lọc đang hoạt động`
                : "Chọn điều kiện lọc"}
            </Text>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleClear}>
            <Text style={styles.resetButtonText}>Xóa</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Filters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 Bộ lọc nhanh</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickFiltersScroll}
              contentContainerStyle={styles.quickFiltersContainer}
            >
              {quickFilters.map((quick, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickFilterChip}
                  onPress={() => {
                    const newFilters = { ...filters };
                    if (quick.dateFrom) {
                      newFilters.dateFrom = quick.dateFrom;
                      newFilters.dateTo = new Date()
                        .toISOString()
                        .split("T")[0];
                    }
                    if (quick.rating) {
                      newFilters.rating = quick.rating;
                    }
                    setFilters(newFilters);
                  }}
                >
                  <Text style={styles.quickFilterIcon}>{quick.icon}</Text>
                  <Text style={styles.quickFilterText}>{quick.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏷️ Bộ lọc đang áp dụng</Text>
              <View style={styles.activeFiltersContainer}>
                {filters.rating && (
                  <View style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>
                      {
                        ratingOptions.find((r) => r.value === filters.rating)
                          ?.emoji
                      }{" "}
                      {filters.rating} sao
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFilters({ ...filters, rating: undefined })
                      }
                      style={styles.removeFilterButton}
                    >
                      <Text style={styles.removeFilterText}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.dateFrom && (
                  <View style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>
                      📅 {filters.dateFrom}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFilters({
                          ...filters,
                          dateFrom: undefined,
                          dateTo: undefined,
                        })
                      }
                      style={styles.removeFilterButton}
                    >
                      <Text style={styles.removeFilterText}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.productId && (
                  <View style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>
                      📦 {filters.productId}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFilters({ ...filters, productId: undefined })
                      }
                      style={styles.removeFilterButton}
                    >
                      <Text style={styles.removeFilterText}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.userId && (
                  <View style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>
                      👤 {filters.userId}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFilters({ ...filters, userId: undefined })
                      }
                      style={styles.removeFilterButton}
                    >
                      <Text style={styles.removeFilterText}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Rating Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Mức độ đánh giá</Text>
            <View style={styles.ratingGrid}>
              {ratingOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.ratingCard,
                    filters.rating === option.value &&
                      styles.selectedRatingCard,
                  ]}
                  onPress={() =>
                    setFilters({ ...filters, rating: option.value })
                  }
                >
                  <Text style={styles.ratingEmoji}>{option.emoji}</Text>
                  <Text
                    style={[
                      styles.ratingLabel,
                      filters.rating === option.value &&
                        styles.selectedRatingText,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value && (
                    <View style={styles.starsContainer}>
                      {renderStars(option.value)}
                    </View>
                  )}
                  {filters.rating === option.value && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Khoảng thời gian</Text>
            <View style={styles.dateCard}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.inputLabel}>Từ ngày</Text>
                <View style={styles.dateInputWrapper}>
                  <CalendarIcon size={20} color="#6C5CE7" />
                  <TextInput
                    style={styles.dateInput}
                    placeholder="YYYY-MM-DD"
                    value={filters.dateFrom || ""}
                    onChangeText={(text) =>
                      setFilters({ ...filters, dateFrom: text })
                    }
                    placeholderTextColor="#8F9BB3"
                  />
                </View>
              </View>

              <View style={styles.dateSeparator}>
                <Text style={styles.dateSeparatorText}>đến</Text>
              </View>

              <View style={styles.dateInputContainer}>
                <Text style={styles.inputLabel}>Đến ngày</Text>
                <View style={styles.dateInputWrapper}>
                  <CalendarIcon size={20} color="#6C5CE7" />
                  <TextInput
                    style={styles.dateInput}
                    placeholder="YYYY-MM-DD"
                    value={filters.dateTo || ""}
                    onChangeText={(text) =>
                      setFilters({ ...filters, dateTo: text })
                    }
                    placeholderTextColor="#8F9BB3"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Search Filters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Tìm kiếm chi tiết</Text>

            <View style={styles.searchCard}>
              <Text style={styles.inputLabel}>Mã sản phẩm</Text>
              <View style={styles.searchInputWrapper}>
                <SearchIcon size={20} color="#6C5CE7" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Nhập mã sản phẩm..."
                  value={filters.productId || ""}
                  onChangeText={(text) =>
                    setFilters({ ...filters, productId: text })
                  }
                  placeholderTextColor="#8F9BB3"
                />
              </View>
            </View>

            <View style={styles.searchCard}>
              <Text style={styles.inputLabel}>Mã khách hàng</Text>
              <View style={styles.searchInputWrapper}>
                <SearchIcon size={20} color="#6C5CE7" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Nhập mã khách hàng..."
                  value={filters.userId || ""}
                  onChangeText={(text) =>
                    setFilters({ ...filters, userId: text })
                  }
                  placeholderTextColor="#8F9BB3"
                />
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetFullButton}
            onPress={handleReset}
          >
            <Text style={styles.resetFullButtonText}>Đặt lại</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <LinearGradient
              colors={["#6C5CE7", "#74b9ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyButtonGradient}
            >
              <FilterIcon size={20} color="#fff" />
              <Text style={styles.applyButtonText}>
                Áp dụng{" "}
                {getActiveFiltersCount() > 0
                  ? `(${getActiveFiltersCount()})`
                  : ""}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayTouch: {
    flex: 1,
  },
  container: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.85,
    backgroundColor: "#F8FAFC",
    shadowColor: "#000",
    shadowOffset: {
      width: -5,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2E3A59",
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  // Quick Filters
  quickFiltersScroll: {
    maxHeight: 60,
  },
  quickFiltersContainer: {
    paddingRight: 20,
    gap: 12,
  },
  quickFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickFilterIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E3A59",
  },

  // Active Filters
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  activeFilterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    marginRight: 8,
  },
  removeFilterButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  removeFilterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  // Rating Grid
  ratingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  ratingCard: {
    width: (width * 0.85 - 64) / 2,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  selectedRatingCard: {
    borderColor: "#6C5CE7",
    backgroundColor: "#F5F4FF",
    borderWidth: 2,
  },
  ratingEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E3A59",
    textAlign: "center",
    marginBottom: 8,
  },
  selectedRatingText: {
    color: "#6C5CE7",
    fontWeight: "700",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 14,
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6C5CE7",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  // Date Inputs
  dateCard: {
    backgroundColor: "#fff",
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
    shadowRadius: 6,
    elevation: 3,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateSeparator: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  dateSeparatorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8F9BB3",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 12,
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E4E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: "#2E3A59",
    marginLeft: 12,
    fontWeight: "600",
  },

  // Search Inputs
  searchCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E4E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2E3A59",
    marginLeft: 12,
    fontWeight: "600",
  },

  // Footer
  bottomSpacing: {
    height: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E4E7EB",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  resetFullButton: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E7EB",
  },
  resetFullButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8F9BB3",
  },
  applyButton: {
    flex: 2,
    borderRadius: 16,
    overflow: "hidden",
  },
  applyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
});

export default ReviewFilter;
