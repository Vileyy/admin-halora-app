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
  Modal,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { addProduct, updateProduct } from "../../redux/slices/productSlice";
import { Product, ProductFormData, ProductVariant } from "../../types/product";
import { uploadImage } from "../../services/cloudinary";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

interface ProductFormScreenProps {
  product?: Product;
  onSave: () => void;
  onCancel: () => void;
}

const categories = [
  "Skincare",
  "Makeup",
  "Hair Care",
  "Body Care",
  "Fragrance",
  "Tools & Accessories",
];

const brands = [
  "Halora",
  "L'Oreal",
  "Maybelline",
  "Revlon",
  "MAC",
  "Chanel",
  "Dior",
  "Other",
];

export const ProductFormScreen: React.FC<ProductFormScreenProps> = ({
  product,
  onSave,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.products);

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    category: "",
    brand: "",
    imageUrl: "",
    variants: [],
    isFlashDeal: false,
    flashDealEndTime: undefined,
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        category: product.category,
        brand: product.brand,
        imageUrl: product.imageUrl,
        variants: product.variants.map((v) => ({
          size: v.size,
          price: v.price,
          stock: v.stock,
          sku: v.sku,
        })),
        isFlashDeal: product.isFlashDeal || false,
        flashDealEndTime: product.flashDealEndTime,
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(true);
        const uploadResult = await uploadImage(
          result.assets[0].uri,
          "halora-products"
        );

        if (uploadResult.success) {
          handleInputChange("imageUrl", uploadResult.url);
        } else {
          Alert.alert("Lỗi", "Không thể upload ảnh. Vui lòng thử lại.");
        }
        setUploading(false);
      }
    } catch (error) {
      setUploading(false);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  const handleAddVariant = () => {
    setEditingVariant(null);
    setShowVariantModal(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setShowVariantModal(true);
  };

  const handleSaveVariant = (variantData: Omit<ProductVariant, "id">) => {
    if (editingVariant) {
      // Edit existing variant
      const updatedVariants = formData.variants.map((v) =>
        v === editingVariant ? { ...variantData, id: editingVariant.id } : v
      );
      handleInputChange("variants", updatedVariants);
    } else {
      // Add new variant
      const newVariant = {
        ...variantData,
        id: Date.now().toString(), // Simple ID generation
      };
      handleInputChange("variants", [...formData.variants, newVariant]);
    }
    setShowVariantModal(false);
    setEditingVariant(null);
  };

  const handleDeleteVariant = (variant: ProductVariant) => {
    const updatedVariants = formData.variants.filter((v) => v !== variant);
    handleInputChange("variants", updatedVariants);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!formData.category) {
      Alert.alert("Lỗi", "Vui lòng chọn danh mục");
      return;
    }
    if (!formData.brand) {
      Alert.alert("Lỗi", "Vui lòng chọn thương hiệu");
      return;
    }
    if (!formData.imageUrl) {
      Alert.alert("Lỗi", "Vui lòng chọn ảnh sản phẩm");
      return;
    }
    if (formData.variants.length === 0) {
      Alert.alert("Lỗi", "Vui lòng thêm ít nhất một loại sản phẩm");
      return;
    }

    try {
      if (product) {
        // Update existing product
        await dispatch(
          updateProduct({
            id: product.id,
            updates: formData,
          })
        );
      } else {
        // Add new product
        await dispatch(addProduct(formData));
      }
      onSave();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu sản phẩm. Vui lòng thử lại.");
    }
  };

  const renderVariantItem = ({ item }: { item: ProductVariant }) => (
    <View style={styles.variantItem}>
      <View style={styles.variantInfo}>
        <Text style={styles.variantSize}>{item.size}</Text>
        <Text style={styles.variantPrice}>
          {item.price.toLocaleString("vi-VN")} VND
        </Text>
        <Text style={styles.variantStock}>Còn: {item.stock}</Text>
      </View>
      <View style={styles.variantActions}>
        <TouchableOpacity
          onPress={() => handleEditVariant(item)}
          style={styles.variantActionButton}
        >
          <Ionicons name="create-outline" size={16} color="#FF99CC" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteVariant(item)}
          style={styles.variantActionButton}
        >
          <Ionicons name="trash-outline" size={16} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
          disabled={loading}
        >
          <Text style={[styles.saveButton, loading && styles.disabledButton]}>
            Lưu
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Ảnh sản phẩm *</Text>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleImagePicker}
            disabled={uploading}
          >
            {formData.imageUrl ? (
              <Image source={{ uri: formData.imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={48} color="#ccc" />
                <Text style={styles.imagePlaceholderText}>
                  {uploading ? "Đang upload..." : "Chọn ảnh"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên sản phẩm *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => handleInputChange("title", text)}
              placeholder="Nhập tên sản phẩm"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              placeholder="Nhập mô tả sản phẩm"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Danh mục *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text
                style={[
                  styles.pickerText,
                  !formData.category && styles.placeholderText,
                ]}
              >
                {formData.category || "Chọn danh mục"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thương hiệu *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowBrandModal(true)}
            >
              <Text
                style={[
                  styles.pickerText,
                  !formData.brand && styles.placeholderText,
                ]}
              >
                {formData.brand || "Chọn thương hiệu"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Variants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Các loại sản phẩm *</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddVariant}
            >
              <Ionicons name="add" size={20} color="#FF99CC" />
              <Text style={styles.addButtonText}>Thêm</Text>
            </TouchableOpacity>
          </View>

          {formData.variants.length > 0 ? (
            <FlatList
              data={formData.variants as ProductVariant[]}
              renderItem={renderVariantItem}
              keyExtractor={(item, index) => item.id || index.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyVariants}>
              <Text style={styles.emptyVariantsText}>
                Chưa có loại sản phẩm nào
              </Text>
            </View>
          )}
        </View>

        {/* Flash Deal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flash Deal</Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              handleInputChange("isFlashDeal", !formData.isFlashDeal)
            }
          >
            <View
              style={[
                styles.checkbox,
                formData.isFlashDeal && styles.checkedCheckbox,
              ]}
            >
              {formData.isFlashDeal && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Đây là sản phẩm Flash Deal</Text>
          </TouchableOpacity>

          {formData.isFlashDeal && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Thời gian kết thúc Flash Deal</Text>
              <TextInput
                style={styles.input}
                value={
                  formData.flashDealEndTime
                    ? new Date(formData.flashDealEndTime)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChangeText={(text) => {
                  const timestamp = new Date(text).getTime();
                  handleInputChange(
                    "flashDealEndTime",
                    isNaN(timestamp) ? undefined : timestamp
                  );
                }}
                placeholder="YYYY-MM-DDTHH:MM"
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn danh mục</Text>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleInputChange("category", item);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>

      {/* Brand Modal */}
      <Modal
        visible={showBrandModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBrandModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn thương hiệu</Text>
            <FlatList
              data={brands}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleInputChange("brand", item);
                    setShowBrandModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>

      {/* Variant Modal */}
      <VariantModal
        visible={showVariantModal}
        variant={editingVariant}
        onSave={handleSaveVariant}
        onClose={() => {
          setShowVariantModal(false);
          setEditingVariant(null);
        }}
      />
    </View>
  );
};

// Variant Modal Component
interface VariantModalProps {
  visible: boolean;
  variant: ProductVariant | null;
  onSave: (variant: Omit<ProductVariant, "id">) => void;
  onClose: () => void;
}

const VariantModal: React.FC<VariantModalProps> = ({
  visible,
  variant,
  onSave,
  onClose,
}) => {
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");

  useEffect(() => {
    if (variant) {
      setSize(variant.size);
      setPrice(variant.price.toString());
      setStock(variant.stock.toString());
      setSku(variant.sku || "");
    } else {
      setSize("");
      setPrice("");
      setStock("");
      setSku("");
    }
  }, [variant]);

  const handleSave = () => {
    if (!size.trim() || !price.trim() || !stock.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Lỗi", "Giá phải là số dương");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      Alert.alert("Lỗi", "Số lượng tồn kho phải là số không âm");
      return;
    }

    onSave({
      size: size.trim(),
      price: priceNum,
      stock: stockNum,
      sku: sku.trim() || undefined,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {variant ? "Chỉnh sửa loại sản phẩm" : "Thêm loại sản phẩm mới"}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dung tích/Kích thước *</Text>
            <TextInput
              style={styles.input}
              value={size}
              onChangeText={setSize}
              placeholder="VD: 50ml, 100g, M, L"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giá (VND) *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Nhập giá"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số lượng tồn kho *</Text>
            <TextInput
              style={styles.input}
              value={stock}
              onChangeText={setStock}
              placeholder="Nhập số lượng"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SKU (tùy chọn)</Text>
            <TextInput
              style={styles.input}
              value={sku}
              onChangeText={setSku}
              placeholder="Mã sản phẩm"
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveModalButton]}
              onPress={handleSave}
            >
              <Text
                style={[styles.modalButtonText, styles.saveModalButtonText]}
              >
                Lưu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF99CC",
  },
  disabledButton: {
    color: "#ccc",
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageSection: {
    backgroundColor: "#fff",
    padding: 16,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCheckbox: {
    backgroundColor: "#FF99CC",
    borderColor: "#FF99CC",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF99CC",
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#FF99CC",
    fontWeight: "500",
  },
  variantItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
  },
  variantInfo: {
    flex: 1,
  },
  variantSize: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  variantPrice: {
    fontSize: 14,
    color: "#FF99CC",
    fontWeight: "600",
  },
  variantStock: {
    fontSize: 12,
    color: "#666",
  },
  variantActions: {
    flexDirection: "row",
  },
  variantActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyVariants: {
    padding: 20,
    alignItems: "center",
  },
  emptyVariantsText: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  saveModalButton: {
    backgroundColor: "#FF99CC",
    borderColor: "#FF99CC",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#333",
  },
  saveModalButtonText: {
    color: "#fff",
  },
});
