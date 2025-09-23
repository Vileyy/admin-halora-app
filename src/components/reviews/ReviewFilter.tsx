import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { ReviewFilters } from "../../types/review";

interface ReviewFilterProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ReviewFilters) => void;
  currentFilters: ReviewFilters;
}

const ReviewFilter: React.FC<ReviewFilterProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<ReviewFilters>(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  const ratingOptions = [
    { label: "Tất cả", value: undefined },
    { label: "5 sao", value: 5 },
    { label: "4 sao", value: 4 },
    { label: "3 sao", value: 3 },
    { label: "2 sao", value: 2 },
    { label: "1 sao", value: 1 },
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Hủy</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Bộ lọc đánh giá</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearButton}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Rating Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
            <View style={styles.ratingOptions}>
              {ratingOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.ratingOption,
                    filters.rating === option.value && styles.selectedOption,
                  ]}
                  onPress={() =>
                    setFilters({ ...filters, rating: option.value })
                  }
                >
                  <View style={styles.ratingContent}>
                    {option.value ? (
                      <View style={styles.starsContainer}>
                        {renderStars(option.value)}
                      </View>
                    ) : (
                      <Text style={styles.allRatingText}>Tất cả đánh giá</Text>
                    )}
                    <Text
                      style={[
                        styles.ratingLabel,
                        filters.rating === option.value &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      filters.rating === option.value &&
                        styles.radioButtonSelected,
                    ]}
                  >
                    {filters.rating === option.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Khoảng thời gian</Text>
            <View style={styles.dateInputs}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.inputLabel}>Từ ngày</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD/MM/YYYY"
                  value={filters.dateFrom || ""}
                  onChangeText={(text) =>
                    setFilters({ ...filters, dateFrom: text })
                  }
                />
              </View>
              <View style={styles.dateInputContainer}>
                <Text style={styles.inputLabel}>Đến ngày</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD/MM/YYYY"
                  value={filters.dateTo || ""}
                  onChangeText={(text) =>
                    setFilters({ ...filters, dateTo: text })
                  }
                />
              </View>
            </View>
          </View>

          {/* Product ID Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mã sản phẩm</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập mã sản phẩm"
              value={filters.productId || ""}
              onChangeText={(text) =>
                setFilters({ ...filters, productId: text })
              }
            />
          </View>

          {/* User ID Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mã khách hàng</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập mã khách hàng"
              value={filters.userId || ""}
              onChangeText={(text) => setFilters({ ...filters, userId: text })}
            />
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Áp dụng bộ lọc</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6EA",
    paddingTop: 50,
  },
  cancelButton: {
    fontSize: 16,
    color: "#8F9BB3",
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E3A59",
  },
  clearButton: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 16,
  },
  ratingOptions: {
    gap: 12,
  },
  ratingOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E6EA",
  },
  selectedOption: {
    borderColor: "#6C5CE7",
    backgroundColor: "#F5F4FF",
  },
  ratingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 12,
  },
  star: {
    fontSize: 18,
    marginRight: 2,
  },
  allRatingText: {
    fontSize: 16,
    color: "#2E3A59",
    fontWeight: "500",
    marginRight: 12,
  },
  ratingLabel: {
    fontSize: 16,
    color: "#2E3A59",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#6C5CE7",
    fontWeight: "600",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E4E6EA",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#6C5CE7",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6C5CE7",
  },
  dateInputs: {
    flexDirection: "row",
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8F9BB3",
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E4E6EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2E3A59",
  },
  textInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E4E6EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2E3A59",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E4E6EA",
  },
  applyButton: {
    backgroundColor: "#6C5CE7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

export default ReviewFilter;
