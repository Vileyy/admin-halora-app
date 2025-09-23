import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  fetchVouchers,
  deleteVoucher,
  toggleVoucherStatus,
  selectVouchers,
  selectVoucherLoading,
  selectVoucherError,
} from "../../redux/slices/voucherSlice";
import {
  VoucherTabBar,
  ProductDiscountTab,
  FreeShippingTab,
} from "../../components/vouchers";
import { Voucher } from "../../types/voucher";

const VouchersScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const vouchers = useSelector(selectVouchers);
  const loading = useSelector(selectVoucherLoading);
  const error = useSelector(selectVoucherError);

  // Local state
  const [activeTab, setActiveTab] = useState("product");

  // Tab configuration
  const tabs = [
    { id: "product", title: "Giảm giá sản phẩm" },
    { id: "shipping", title: "Miễn phí vận chuyển" },
  ];

  // Load data on component mount
  useEffect(() => {
    handleRefresh();
  }, []);

  // Show error if any
  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error);
    }
  }, [error]);

  const handleRefresh = () => {
    dispatch(fetchVouchers());
  };

  const handleVoucherPress = (voucher: Voucher) => {
    Alert.alert(
      "Chi tiết voucher",
      `Mã: ${voucher.code}\nTiêu đề: ${voucher.title}\nLoại: ${
        voucher.type === "product" ? "Giảm giá sản phẩm" : "Miễn phí vận chuyển"
      }\nGiảm: ${
        voucher.discountType === "percentage"
          ? `${voucher.discountValue}%`
          : `${voucher.discountValue.toLocaleString("vi-VN")}đ`
      }\nĐơn tối thiểu: ${voucher.minOrder.toLocaleString(
        "vi-VN"
      )}đ\nĐã dùng: ${voucher.usageCount}/${voucher.usageLimit}\nTrạng thái: ${
        voucher.status === "active"
          ? "Đang hoạt động"
          : voucher.status === "expired"
          ? "Hết hạn"
          : "Tạm dừng"
      }`,
      [{ text: "OK" }]
    );
  };

  const handleToggleStatus = (voucher: Voucher) => {
    const newStatus = voucher.status === "active" ? "tạm dừng" : "kích hoạt";
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc muốn ${newStatus} voucher "${voucher.code}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () =>
            dispatch(
              toggleVoucherStatus({
                id: voucher.id,
                currentStatus: voucher.status,
              })
            ),
        },
      ]
    );
  };

  const handleDeleteVoucher = (voucher: Voucher) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa voucher "${voucher.code}"?\nHành động này không thể hoàn tác.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => dispatch(deleteVoucher(voucher.id)),
          style: "destructive",
        },
      ]
    );
  };

  const handleAddVoucher = (type: "product" | "shipping") => {
    navigation.navigate("AddVoucher", { type });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "product":
        return (
          <ProductDiscountTab
            vouchers={vouchers}
            loading={loading}
            onRefresh={handleRefresh}
            onVoucherPress={handleVoucherPress}
            onToggleStatus={handleToggleStatus}
            onDeleteVoucher={handleDeleteVoucher}
            onAddVoucher={() => handleAddVoucher("product")}
          />
        );
      case "shipping":
        return (
          <FreeShippingTab
            vouchers={vouchers}
            loading={loading}
            onRefresh={handleRefresh}
            onVoucherPress={handleVoucherPress}
            onToggleStatus={handleToggleStatus}
            onDeleteVoucher={handleDeleteVoucher}
            onAddVoucher={() => handleAddVoucher("shipping")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý Voucher</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Bar */}
      <VoucherTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      {/* Tab Content */}
      <View style={styles.tabContent}>{renderTabContent()}</View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40, // Same width as back button for centering
  },
  tabContent: {
    flex: 1,
  },
});

export default VouchersScreen;
