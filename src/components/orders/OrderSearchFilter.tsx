import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderFilters } from "../../types/order";

interface OrderSearchFilterProps {
  onFiltersChange?: (filters: OrderFilters) => void;
  filters: OrderFilters;
  ordersCount: number;
}

const OrderSearchFilter: React.FC<OrderSearchFilterProps> = ({
  onFiltersChange,
  filters,
  ordersCount,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "shipped", label: "Đang giao hàng" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const paymentMethodOptions = [
    { value: "all", label: "Tất cả" },
    { value: "cod", label: "COD" },
    { value: "vnpay", label: "VNPay" },
    { value: "zalopay", label: "ZaloPay" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Ngày tạo" },
    { value: "totalAmount", label: "Giá trị" },
    { value: "status", label: "Trạng thái" },
  ];

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    onFiltersChange?.({
      ...filters,
      searchTerm: text,
    });
  };

  const handleStatusFilter = (status: string) => {
    onFiltersChange?.({
      ...filters,
      status,
    });
  };

  const handlePaymentMethodFilter = (paymentMethod: string) => {
    onFiltersChange?.({
      ...filters,
      paymentMethod,
    });
  };

  const handleSort = (sortBy: string) => {
    const sortOrder =
      filters.sortBy === sortBy && filters.sortOrder === "desc"
        ? "asc"
        : "desc";
    onFiltersChange?.({
      ...filters,
      sortBy: sortBy as any,
      sortOrder,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    onFiltersChange?.({
      status: "all",
      paymentMethod: "all",
      searchTerm: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Bộ lọc</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContent}>
          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Trạng thái</Text>
            <View style={styles.filterOptions}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    filters.status === option.value &&
                      styles.filterOptionActive,
                  ]}
                  onPress={() => handleStatusFilter(option.value)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.status === option.value &&
                        styles.filterOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment Method Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>
              Phương thức thanh toán
            </Text>
            <View style={styles.filterOptions}>
              {paymentMethodOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    filters.paymentMethod === option.value &&
                      styles.filterOptionActive,
                  ]}
                  onPress={() => handlePaymentMethodFilter(option.value)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.paymentMethod === option.value &&
                        styles.filterOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort Options */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sắp xếp theo</Text>
            <View style={styles.filterOptions}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    filters.sortBy === option.value &&
                      styles.filterOptionActive,
                  ]}
                  onPress={() => handleSort(option.value)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.sortBy === option.value &&
                        styles.filterOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {filters.sortBy === option.value && (
                    <Ionicons
                      name={
                        filters.sortOrder === "desc" ? "arrow-down" : "arrow-up"
                      }
                      size={16}
                      color="#007AFF"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.filterActions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm đơn hàng, khách hàng..."
            value={searchTerm}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {ordersCount} đơn hàng
          {(filters.searchTerm ||
            filters.status !== "all" ||
            filters.paymentMethod !== "all") && (
            <Text style={styles.filteredText}> (đã lọc)</Text>
          )}
        </Text>
      </View>

      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    marginLeft: 8,
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
  },
  filteredText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  filterModal: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  filterContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  filterOptionActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#007AFF",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#666",
  },
  filterOptionTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  filterActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default OrderSearchFilter;
