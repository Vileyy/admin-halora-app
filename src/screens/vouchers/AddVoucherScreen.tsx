import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  addVoucher,
  selectVoucherLoading,
} from "../../redux/slices/voucherSlice";
import { VoucherFormData } from "../../types/voucher";

interface AddVoucherScreenProps {
  navigation: any;
  route: {
    params?: {
      type?: "shipping" | "product";
    };
  };
}

const AddVoucherScreen: React.FC<AddVoucherScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectVoucherLoading);

  const voucherType = route.params?.type || "product";

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrder: "",
    usageLimit: "100",
  });

  // Helper function to format VND currency
  const formatVND = (value: string): string => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    if (!numericValue) return "";

    // Convert to number and format with thousands separator
    const number = parseInt(numericValue);
    return number.toLocaleString("vi-VN");
  };

  // Helper function to parse VND formatted string back to number
  const parseVND = (formattedValue: string): number => {
    const numericValue = formattedValue.replace(/[^0-9]/g, "");
    return parseInt(numericValue) || 0;
  };

  // Helper function to handle numeric input with VND formatting
  const handleVNDInput = (value: string, field: string) => {
    // Remove any negative signs and non-numeric characters except existing formatting
    const cleanValue = value.replace(/[-]/g, "");
    const formatted = formatVND(cleanValue);

    setFormData((prev) => ({
      ...prev,
      [field]: formatted,
    }));
  };

  // Helper function to handle percentage input (no negative, max 100)
  const handlePercentageInput = (value: string) => {
    // Remove negative signs and non-numeric characters
    const cleanValue = value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(cleanValue) || 0;

    // Limit percentage to 100
    const limitedValue = Math.min(numericValue, 100);

    setFormData((prev) => ({
      ...prev,
      discountValue: limitedValue.toString(),
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.code.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã voucher");
      return;
    }
    if (!formData.title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề");
      return;
    }
    // Validate discount value
    const discountValue =
      formData.discountType === "percentage"
        ? parseInt(formData.discountValue)
        : parseVND(formData.discountValue);

    if (!formData.discountValue || discountValue <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập giá trị giảm giá hợp lệ");
      return;
    }

    const voucherData: VoucherFormData = {
      code: formData.code.toUpperCase(),
      title: formData.title,
      discountType: formData.discountType,
      discountValue: discountValue,
      type: voucherType,
      minOrder: parseVND(formData.minOrder) || 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      usageLimit: parseInt(formData.usageLimit) || 100,
    };

    try {
      await dispatch(addVoucher(voucherData)).unwrap();
      Alert.alert(
        "Thành công",
        `${
          voucherType === "shipping" ? "Voucher vận chuyển" : "Mã giảm giá"
        } đã được tạo thành công!`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert("Lỗi", error || "Không thể tạo voucher");
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
        <Text style={styles.headerTitle}>
          Tạo{" "}
          {voucherType === "shipping" ? "Voucher Vận Chuyển" : "Mã Giảm Giá"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type Indicator */}
        <View
          style={[
            styles.typeIndicator,
            {
              backgroundColor:
                voucherType === "shipping" ? "#00B894" : "#6c5ce7",
            },
          ]}
        >
          <Ionicons
            name={voucherType === "shipping" ? "car" : "pricetag"}
            size={24}
            color="white"
          />
          <Text style={styles.typeText}>
            {voucherType === "shipping"
              ? "Voucher Miễn Phí Vận Chuyển"
              : "Mã Giảm Giá Sản Phẩm"}
          </Text>
        </View>

        {/* Code Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mã voucher *</Text>
          <TextInput
            style={styles.input}
            value={formData.code}
            onChangeText={(text) =>
              setFormData({ ...formData, code: text.toUpperCase() })
            }
            placeholder={
              voucherType === "shipping" ? "VD: FREESHIP50" : "VD: SALE20"
            }
            placeholderTextColor="#999"
            maxLength={20}
            autoCapitalize="characters"
          />
        </View>

        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tiêu đề *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder={
              voucherType === "shipping"
                ? "VD: Miễn phí vận chuyển toàn quốc"
                : "VD: Giảm giá sản phẩm mùa hè"
            }
            placeholderTextColor="#999"
            maxLength={100}
            multiline
          />
        </View>

        {/* Discount Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Loại giảm giá</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.discountType}
              onValueChange={(value) =>
                setFormData({ ...formData, discountType: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Phần trăm (%)" value="percentage" />
              <Picker.Item label="Cố định (đ)" value="fixed" />
            </Picker>
          </View>
        </View>

        {/* Discount Value */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Giá trị giảm *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                (formData.discountType === "fixed" ||
                  formData.discountType === "percentage") &&
                  styles.inputWithSuffix,
              ]}
              value={formData.discountValue}
              onChangeText={(text) => {
                if (formData.discountType === "percentage") {
                  handlePercentageInput(text);
                } else {
                  handleVNDInput(text, "discountValue");
                }
              }}
              placeholder={formData.discountType === "percentage" ? "0" : "0"}
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {formData.discountType === "percentage" && (
              <Text style={styles.inputSuffix}>%</Text>
            )}
            {formData.discountType === "fixed" && (
              <Text style={styles.inputSuffix}>VNĐ</Text>
            )}
          </View>
          <Text style={styles.helper}>
            {formData.discountType === "percentage"
              ? voucherType === "shipping"
                ? "Nhập phần trăm giảm phí vận chuyển (1-100%)"
                : "Nhập phần trăm giảm giá sản phẩm (1-100%)"
              : voucherType === "shipping"
              ? "Nhập số tiền giảm phí vận chuyển (VD: 50,000)"
              : "Nhập số tiền giảm giá sản phẩm (VD: 100,000)"}
          </Text>
        </View>

        {/* Min Order */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Đơn hàng tối thiểu</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputWithSuffix]}
              value={formData.minOrder}
              onChangeText={(text) => handleVNDInput(text, "minOrder")}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <Text style={styles.inputSuffix}>VNĐ</Text>
          </View>
          <Text style={styles.helper}>
            Để trống nếu không có yêu cầu tối thiểu (VD: 100,000)
          </Text>
        </View>

        {/* Usage Limit */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Giới hạn sử dụng</Text>
          <TextInput
            style={styles.input}
            value={formData.usageLimit}
            onChangeText={(text) => {
              // Remove negative signs and non-numeric characters
              const cleanValue = text.replace(/[^0-9]/g, "");
              const numericValue = parseInt(cleanValue) || 0;

              setFormData((prev) => ({
                ...prev,
                usageLimit: numericValue > 0 ? numericValue.toString() : "",
              }));
            }}
            placeholder="100"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <Text style={styles.helper}>
            Số lần tối đa voucher có thể được sử dụng (VD: 100)
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Voucher sẽ có hiệu lực trong 30 ngày kể từ khi tạo. Bạn có thể chỉnh
            sửa thời gian sau khi tạo.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor:
                voucherType === "shipping" ? "#00B894" : "#6c5ce7",
            },
            loading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Đang tạo..." : "Tạo voucher"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  inputWithSuffix: {
    flex: 1,
    paddingRight: 60,
  },
  inputSuffix: {
    position: "absolute",
    right: 16,
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    backgroundColor: "white",
    paddingLeft: 8,
  },
  helper: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  picker: {
    height: 50,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#f0f8ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default AddVoucherScreen;
