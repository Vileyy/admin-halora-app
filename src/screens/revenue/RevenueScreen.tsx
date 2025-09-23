import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  fetchRevenueRecords,
  setFilter,
  resetFilter,
  selectRevenueStats,
  selectDailyRevenue,
  selectFilteredRecords,
  selectRevenueLoading,
  selectRevenueError,
  selectRevenueFilter,
  selectUniqueCategories,
  selectAvailablePeriods,
  selectProductStats,
  selectCategoryStats,
} from "../../redux/slices/revenueSlice";
import {
  RevenueTabBar,
  OverviewTab,
  ProductsTab,
  CategoriesTab,
} from "../../components/revenue";

const RevenueScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const stats = useSelector(selectRevenueStats);
  const dailyRevenue = useSelector(selectDailyRevenue);
  const filteredRecords = useSelector(selectFilteredRecords);
  const loading = useSelector(selectRevenueLoading);
  const error = useSelector(selectRevenueError);
  const filter = useSelector(selectRevenueFilter);
  const categories = useSelector(selectUniqueCategories);
  const availablePeriods = useSelector(selectAvailablePeriods);
  const productStats = useSelector(selectProductStats);
  const categoryStats = useSelector(selectCategoryStats);

  // Local state
  const [activeTab, setActiveTab] = useState("overview");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempFilter, setTempFilter] = useState(filter);

  // Load data on component mount
  useEffect(() => {
    handleRefresh();
  }, []);

  // Show error alert
  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error, [{ text: "OK" }]);
    }
  }, [error]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchRevenueRecords());
  }, [dispatch]);

  const handleApplyFilter = () => {
    dispatch(setFilter(tempFilter));
    setFilterModalVisible(false);
  };

  const handleResetFilter = () => {
    dispatch(resetFilter());
    setTempFilter({
      month: 9, // Set to September to match the data
      year: 2025,
    });
    setFilterModalVisible(false);
  };

  // Tab configuration
  const tabs = [
    { id: "overview", title: "Tổng quan" },
    { id: "products", title: "Sản phẩm" },
    { id: "categories", title: "Danh mục" },
  ];

  const getMonthName = (month: number) => {
    const monthNames = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return monthNames[month - 1];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            stats={stats}
            dailyRevenue={dailyRevenue}
            filteredRecords={filteredRecords}
            loading={loading}
            filter={filter}
            onRefresh={handleRefresh}
            onItemPress={(item) => {
              Alert.alert(
                "Chi tiết đơn hàng",
                `Đơn hàng: ${item.orderId}\nSản phẩm: ${
                  item.productName
                }\nKhách hàng: ${
                  item.userInfo.displayName
                }\nTổng tiền: ${item.totalPrice.toLocaleString("vi-VN")}đ`,
                [{ text: "OK" }]
              );
            }}
            getMonthName={getMonthName}
          />
        );
      case "products":
        return <ProductsTab productStats={productStats} loading={loading} />;
      case "categories":
        return (
          <CategoriesTab categoryStats={categoryStats} loading={loading} />
        );
      default:
        return null;
    }
  };

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bộ lọc doanh thu</Text>
            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Tháng</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tempFilter.month}
                onValueChange={(value) =>
                  setTempFilter({ ...tempFilter, month: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Tất cả" value={undefined} />
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <Picker.Item
                    key={month}
                    label={getMonthName(month)}
                    value={month}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Năm</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tempFilter.year}
                onValueChange={(value) =>
                  setTempFilter({ ...tempFilter, year: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Tất cả" value={undefined} />
                {availablePeriods
                  .map((p) => p.year)
                  .filter((year, index, self) => self.indexOf(year) === index)
                  .sort((a, b) => b - a)
                  .map((year) => (
                    <Picker.Item
                      key={year}
                      label={year.toString()}
                      value={year}
                    />
                  ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Danh mục</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tempFilter.category}
                onValueChange={(value) =>
                  setTempFilter({ ...tempFilter, category: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Tất cả" value={undefined} />
                {categories.map((category) => (
                  <Picker.Item
                    key={category}
                    label={category}
                    value={category}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.resetButton]}
              onPress={handleResetFilter}
            >
              <Text style={styles.resetButtonText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.applyButton]}
              onPress={handleApplyFilter}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý Doanh thu</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setTempFilter(filter);
            setFilterModalVisible(true);
          }}
        >
          <Ionicons name="filter" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <RevenueTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      {/* Tab Content */}
      <View style={styles.tabContent}>{renderTabContent()}</View>

      {/* Filter Modal */}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  resetButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  applyButton: {
    backgroundColor: "#007AFF",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default RevenueScreen;
