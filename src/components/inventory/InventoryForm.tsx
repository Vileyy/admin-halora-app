import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { InventoryItem, Variant, Media } from "../../types/inventory";
import { uploadImage } from "../../services/cloudinary";
import { fetchBrands, Brand } from "../../services/brandService";

interface InventoryFormProps {
  initialItem?: InventoryItem;
  onSubmit: (itemData: any) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
}

interface FormVariant {
  name: string;
  importPrice: string;
  price: string;
  stockQty: string;
}

interface FormData {
  name: string;
  description: string;
  supplier: string;
  brandId: string;
  media: Media[];
  variants: FormVariant[];
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
  initialItem,
  onSubmit,
  isLoading = false,
  submitButtonText = "Lưu sản phẩm",
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: initialItem?.name || "",
    description: initialItem?.description || "",
    supplier: initialItem?.supplier || "",
    brandId: initialItem?.brandId || "",
    media: initialItem?.media || [],
    variants: initialItem?.variants?.map((v) => ({
      name: v.name,
      importPrice: v.importPrice.toString(),
      price: v.price.toString(),
      stockQty: v.stockQty.toString(),
    })) || [{ name: "", importPrice: "", price: "", stockQty: "" }],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoadingBrands(true);
    try {
      const brandsData = await fetchBrands();
      setBrands(brandsData);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách thương hiệu");
    } finally {
      setLoadingBrands(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof FormVariant,
    value: string
  ) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "", importPrice: "", price: "", stockQty: "" },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      const updatedVariants = formData.variants.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, variants: updatedVariants }));
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Lỗi",
        "Cần cấp quyền truy cập thư viện ảnh để thêm hình ảnh sản phẩm."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadingImage(true);
      try {
        const uploadResponse = await uploadImage(result.assets[0].uri);
        const newMedia: Media = {
          id: `media_${Date.now()}_${formData.media.length}`,
          url: uploadResponse.url,
          type: "image",
          order: formData.media.length,
        };
        setFormData((prev) => ({
          ...prev,
          media: [...prev.media, newMedia],
        }));
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải lên hình ảnh. Vui lòng thử lại.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeImage = (index: number) => {
    const updatedMedia = formData.media.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, media: updatedMedia }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên sản phẩm");
      return false;
    }

    if (!formData.supplier.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nhà cung cấp");
      return false;
    }

    if (!formData.brandId) {
      Alert.alert("Lỗi", "Vui lòng chọn thương hiệu");
      return false;
    }

    if (formData.variants.some((v) => !v.name.trim())) {
      Alert.alert("Lỗi", "Vui lòng nhập tên cho tất cả biến thể");
      return false;
    }

    if (
      formData.variants.some(
        (v) => !v.importPrice.trim() || !v.price.trim() || !v.stockQty.trim()
      )
    ) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập đầy đủ thông tin giá và số lượng cho tất cả biến thể"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const variants: Variant[] = formData.variants.map((v, index) => ({
        id:
          initialItem?.variants?.[index]?.id ||
          `variant_${Date.now()}_${index}`,
        name: v.name,
        importPrice: parseFloat(v.importPrice),
        price: parseFloat(v.price),
        stockQty: parseInt(v.stockQty),
        createdAt:
          initialItem?.variants?.[index]?.createdAt || new Date().toISOString(),
      }));

      const itemData = {
        name: formData.name,
        description: formData.description,
        supplier: formData.supplier,
        brandId: formData.brandId,
        media: formData.media,
        variants,
      };

      await onSubmit(itemData);
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên sản phẩm *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Nhập tên sản phẩm"
              placeholderTextColor="#8F9BB3"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nhà cung cấp *</Text>
            <TextInput
              style={styles.input}
              value={formData.supplier}
              onChangeText={(value) => handleInputChange("supplier", value)}
              placeholder="Nhập tên nhà cung cấp"
              placeholderTextColor="#8F9BB3"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thương hiệu *</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowBrandModal(true)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !formData.brandId && styles.placeholderText,
                ]}
              >
                {formData.brandId
                  ? brands.find((b) => b.id === formData.brandId)?.name ||
                    "Chọn thương hiệu"
                  : "Chọn thương hiệu"}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#8F9BB3"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              placeholder="Nhập mô tả sản phẩm"
              placeholderTextColor="#8F9BB3"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình ảnh sản phẩm</Text>

          <View style={styles.mediaContainer}>
            {formData.media.map((media, index) => (
              <View key={media.id} style={styles.mediaItem}>
                <Image
                  source={{ uri: String(media.url) }}
                  style={styles.mediaImage}
                />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => removeImage(index)}
                >
                  <MaterialIcons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addMediaButton}
              onPress={pickImage}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color="#FF99CC" />
              ) : (
                <MaterialIcons name="add-a-photo" size={24} color="#FF99CC" />
              )}
              <Text style={styles.addMediaText}>
                {uploadingImage ? "Đang tải..." : "Thêm ảnh"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Variants Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Biến thể sản phẩm</Text>
            <TouchableOpacity style={styles.addButton} onPress={addVariant}>
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Thêm</Text>
            </TouchableOpacity>
          </View>

          {formData.variants.map((variant, index) => (
            <View key={index} style={styles.variantCard}>
              <View style={styles.variantHeader}>
                <Text style={styles.variantTitle}>Biến thể {index + 1}</Text>
                {formData.variants.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeVariant(index)}
                  >
                    <MaterialIcons name="delete" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tên biến thể *</Text>
                <TextInput
                  style={styles.input}
                  value={variant.name}
                  onChangeText={(value) =>
                    handleVariantChange(index, "name", value)
                  }
                  placeholder="VD: 50ml, Size M, Màu đỏ..."
                  placeholderTextColor="#8F9BB3"
                />
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Giá nhập *</Text>
                  <TextInput
                    style={styles.input}
                    value={variant.importPrice}
                    onChangeText={(value) =>
                      handleVariantChange(index, "importPrice", value)
                    }
                    placeholder="0"
                    placeholderTextColor="#8F9BB3"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.label}>Giá bán *</Text>
                  <TextInput
                    style={styles.input}
                    value={variant.price}
                    onChangeText={(value) =>
                      handleVariantChange(index, "price", value)
                    }
                    placeholder="0"
                    placeholderTextColor="#8F9BB3"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Số lượng tồn kho *</Text>
                <TextInput
                  style={styles.input}
                  value={variant.stockQty}
                  onChangeText={(value) =>
                    handleVariantChange(index, "stockQty", value)
                  }
                  placeholder="0"
                  placeholderTextColor="#8F9BB3"
                  keyboardType="numeric"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>{submitButtonText}</Text>
          )}
        </TouchableOpacity>

        {/* Brand Selection Modal */}
        <Modal
          visible={showBrandModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBrandModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn thương hiệu</Text>
                <TouchableOpacity
                  onPress={() => setShowBrandModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#2E3A59" />
                </TouchableOpacity>
              </View>

              {loadingBrands ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FF99CC" />
                  <Text style={styles.loadingText}>
                    Đang tải thương hiệu...
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={brands}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.brandItem,
                        formData.brandId === item.id &&
                          styles.selectedBrandItem,
                      ]}
                      onPress={() => {
                        handleInputChange("brandId", item.id);
                        setShowBrandModal(false);
                      }}
                    >
                      <Image
                        source={{ uri: String(item.logoUrl) }}
                        style={styles.brandLogo}
                        resizeMode="contain"
                      />
                      <View style={styles.brandInfo}>
                        <Text style={styles.brandName}>{item.name}</Text>
                        <Text style={styles.brandDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                      </View>
                      {formData.brandId === item.id && (
                        <MaterialIcons name="check" size={24} color="#FF99CC" />
                      )}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  form: {
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#2E3A59",
    backgroundColor: "#F7F9FC",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  mediaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  mediaItem: {
    position: "relative",
  },
  mediaImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  removeMediaButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  addMediaButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF99CC",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addMediaText: {
    fontSize: 12,
    color: "#FF99CC",
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF99CC",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  variantCard: {
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF99CC",
  },
  variantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  variantTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
  },
  removeButton: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: "#FF99CC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F7F9FC",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#2E3A59",
    flex: 1,
  },
  placeholderText: {
    color: "#8F9BB3",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F4",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#8F9BB3",
  },
  brandItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F4",
  },
  selectedBrandItem: {
    backgroundColor: "#F8F0FF",
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 4,
  },
  brandDescription: {
    fontSize: 14,
    color: "#8F9BB3",
    lineHeight: 18,
  },
});
