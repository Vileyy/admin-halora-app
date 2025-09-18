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
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Product, ProductVariant } from "../../types/product";
import { InventoryItem } from "../../types/inventory";
import { uploadImage } from "../../services/cloudinary";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchInventory } from "../../redux/slices/inventorySlice";
import { fetchAllBrands } from "../../redux/slices/brandSlice";

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (productData: any) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  useInventorySelection?: boolean; // Mới: chế độ chọn từ kho
}

interface FormVariant {
  size: string;
  price: string;
  stock: string;
  sku?: string;
  variantId?: string; // ID của variant từ kho
}

interface FormData {
  title: string;
  description: string;
  category: string;
  brand: string;
  imageUrl: string;
  variants: FormVariant[];
  isFlashDeal: boolean;
  selectedInventoryId?: string; // ID sản phẩm từ kho
  originalProductId?: string; // Tham chiếu đến sản phẩm gốc trong kho
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSubmit,
  isLoading = false,
  submitButtonText = "Lưu sản phẩm",
  useInventorySelection = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: inventoryItems, loading: inventoryLoading } = useSelector(
    (state: RootState) => state.inventory
  );
  const { brands, loading: brandsLoading } = useSelector(
    (state: RootState) => state.brands
  );
  const [formData, setFormData] = useState<FormData>({
    title: initialProduct?.title || "",
    description: initialProduct?.description || "",
    category: initialProduct?.isFlashDeal ? "FlashDeals" : "new_product",
    brand: initialProduct?.brand || "",
    imageUrl: initialProduct?.imageUrl || "",
    variants: initialProduct?.variants?.map((v) => ({
      size: v.size,
      price: v.price.toString(),
      stock: v.stock.toString(),
      sku: v.sku || "",
    })) || [{ size: "", price: "", stock: "", sku: "" }],
    isFlashDeal: initialProduct?.isFlashDeal || false,
    selectedInventoryId: "",
    originalProductId: "",
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedInventoryItem, setSelectedInventoryItem] =
    useState<InventoryItem | null>(null);
  const [availableVariants, setAvailableVariants] = useState<any[]>([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);

  // Fetch inventory items và brands khi component mount
  useEffect(() => {
    if (useInventorySelection) {
      dispatch(fetchInventory());
      dispatch(fetchAllBrands());
    }
  }, [dispatch, useInventorySelection]);

  // Hàm để lấy tên brand từ brandId
  const getBrandName = (brandId: string): string => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "Unknown Brand";
  };

  // Xử lý khi chọn sản phẩm từ kho
  const handleInventorySelection = (inventoryId: string) => {
    const selectedItem = inventoryItems.find((item) => item.id === inventoryId);
    if (selectedItem) {
      setSelectedInventoryItem(selectedItem);
      setAvailableVariants(selectedItem.variants || []);
      setShowInventoryModal(false);

      // Tự động điền thông tin
      setFormData((prev) => ({
        ...prev,
        selectedInventoryId: inventoryId,
        originalProductId: inventoryId,
        title: selectedItem.name,
        description: selectedItem.description,
        brand: getBrandName(selectedItem.brandId),
        imageUrl: selectedItem.media?.[0]?.url || "",
        variants: [], 
      }));
      
      setErrors({});
    }
  };

  // Render item cho FlatList trong modal
  const renderInventoryItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity
      style={styles.inventoryItem}
      onPress={() => handleInventorySelection(item.id)}
    >
      <Image
        source={{
          uri: item.media?.[0]?.url || "https://via.placeholder.com/60",
        }}
        style={styles.inventoryItemImage}
      />
      <View style={styles.inventoryItemInfo}>
        <Text style={styles.inventoryItemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.inventoryItemSupplier}>
          {getBrandName(item.brandId)}
        </Text>
        <Text style={styles.inventoryItemVariants}>
          {item.variants?.length || 0} biến thể
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  // Xử lý chọn variant từ kho
  const handleVariantSelection = (variantId: string) => {
    if (!selectedInventoryItem) return;

    const selectedVariant = selectedInventoryItem.variants.find(
      (v) => v.id === variantId
    );
    if (selectedVariant) {
      // Thêm hoặc cập nhật variant trong form
      const newVariant: FormVariant = {
        size: selectedVariant.name,
        price: selectedVariant.price.toString(),
        stock: selectedVariant.stockQty.toString(),
        sku: `${selectedInventoryItem.id}_${selectedVariant.name}`,
        variantId: selectedVariant.id,
      };

      setFormData((prev) => ({
        ...prev,
        variants: [
          ...prev.variants.filter((v) => v.variantId !== variantId),
          newVariant,
        ],
      }));
    }
  };

  // Xóa variant đã chọn
  const removeSelectedVariant = (variantId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.variantId !== variantId),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (useInventorySelection && !formData.selectedInventoryId) {
      newErrors.selectedInventoryId = "Vui lòng chọn sản phẩm từ kho";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả sản phẩm là bắt buộc";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Thương hiệu là bắt buộc";
    }

    if (!formData.imageUrl) {
      newErrors.imageUrl = "Hình ảnh sản phẩm là bắt buộc";
    }

    // Validate variants
    if (formData.variants.length === 0) {
      if (useInventorySelection) {
        newErrors.variants =
          "Vui lòng chọn ít nhất một dung tích/kích thước từ sản phẩm";
      } else {
        newErrors.variants = "Cần có ít nhất một biến thể sản phẩm";
      }
    } else {
      formData.variants.forEach((variant, index) => {
        if (!variant.size.trim()) {
          newErrors[`variant_${index}_size`] = "Kích thước là bắt buộc";
        }
        if (
          !variant.price ||
          isNaN(Number(variant.price)) ||
          Number(variant.price) <= 0
        ) {
          newErrors[`variant_${index}_price`] = "Giá phải là số dương";
        }
        if (
          !variant.stock ||
          isNaN(Number(variant.stock)) ||
          Number(variant.stock) < 0
        ) {
          newErrors[`variant_${index}_stock`] = "Số lượng phải là số không âm";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin nhập vào");
      return;
    }

    const productData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      brand: formData.brand.trim(),
      imageUrl: formData.imageUrl,
      variants: formData.variants.map((variant) => ({
        size: variant.size.trim(),
        price: Number(variant.price),
        stock: Number(variant.stock),
        sku: variant.sku?.trim() || "",
      })),
      isFlashDeal: formData.isFlashDeal,
      ...(useInventorySelection && {
        originalProductId: formData.originalProductId,
      }),
    };

    await onSubmit(productData);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh để chọn hình");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUploading(true);
        try {
          const imageUri = result.assets[0].uri;
          console.log("Selected image URI:", imageUri);

          const uploadResult = await uploadImage(imageUri, "halora-products");
          console.log("Upload result:", uploadResult);

          if (uploadResult.success && uploadResult.url) {
            setFormData((prev) => ({ ...prev, imageUrl: uploadResult.url! }));
            setErrors((prev) => ({ ...prev, imageUrl: "" }));
            Alert.alert("Thành công", "Ảnh đã được tải lên thành công!");
          } else {
            const errorMessage =
              uploadResult.error || "Không thể tải ảnh lên. Vui lòng thử lại.";
            console.error("Upload failed:", errorMessage);
            Alert.alert("Lỗi tải ảnh", errorMessage);
          }
        } catch (error) {
          console.error("Error in image upload:", error);
          Alert.alert(
            "Lỗi",
            `Có lỗi xảy ra khi tải ảnh lên: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        } finally {
          setImageUploading(false);
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh");
      setImageUploading(false);
    }
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", price: "", stock: "", sku: "" }],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };

  const updateVariant = (
    index: number,
    field: keyof FormVariant,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));

    // Clear error for this field
    setErrors((prev) => ({ ...prev, [`variant_${index}_${field}`]: "" }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>
          {useInventorySelection
            ? "Thêm sản phẩm từ kho"
            : "Thông tin sản phẩm"}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {useInventorySelection
            ? "Chọn sản phẩm từ kho và tùy chỉnh thông tin bán hàng"
            : "Điền đầy đủ thông tin để tạo sản phẩm mới"}
        </Text>
      </View>

      {/* Inventory Selection Card */}
      {useInventorySelection && (
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="inventory" size={24} color="#FF99CC" />
            <Text style={styles.cardTitle}>Chọn sản phẩm từ kho</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.inventorySelector,
              errors.selectedInventoryId && styles.inputError,
            ]}
            onPress={() => setShowInventoryModal(true)}
            disabled={inventoryLoading}
          >
            {selectedInventoryItem ? (
              <View style={styles.selectedItemContainer}>
                <Image
                  source={{
                    uri:
                      selectedInventoryItem.media?.[0]?.url ||
                      "https://via.placeholder.com/50",
                  }}
                  style={styles.selectedItemImage}
                />
                <View style={styles.selectedItemInfo}>
                  <Text style={styles.selectedItemName} numberOfLines={1}>
                    {selectedInventoryItem.name}
                  </Text>
                  <Text style={styles.selectedItemBrand}>
                    {getBrandName(selectedInventoryItem.brandId)}
                  </Text>
                  <Text style={styles.selectedItemCount}>
                    {selectedInventoryItem.variants?.length || 0} biến thể có
                    sẵn
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialIcons
                  name="add-shopping-cart"
                  size={32}
                  color="#FF99CC"
                />
                <View style={styles.placeholderTextContainer}>
                  <Text style={styles.placeholderTitle}>
                    {inventoryLoading ? "Đang tải..." : "Chọn sản phẩm từ kho"}
                  </Text>
                  <Text style={styles.placeholderSubtitle}>
                    Nhấn để xem danh sách sản phẩm có sẵn
                  </Text>
                </View>
              </View>
            )}
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#666" />
          </TouchableOpacity>

          {errors.selectedInventoryId && (
            <Text style={styles.errorText}>{errors.selectedInventoryId}</Text>
          )}

          {/* Modal */}
          <Modal
            visible={showInventoryModal}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                  <MaterialIcons name="inventory" size={24} color="#FF99CC" />
                  <Text style={styles.modalTitle}>Chọn sản phẩm từ kho</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowInventoryModal(false)}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {inventoryLoading ? (
                <View style={styles.modalLoadingContainer}>
                  <ActivityIndicator size="large" color="#FF99CC" />
                  <Text style={styles.modalLoadingText}>
                    Đang tải danh sách kho...
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={inventoryItems}
                  renderItem={renderInventoryItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.inventoryList}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => (
                    <View style={styles.itemSeparator} />
                  )}
                />
              )}
            </View>
          </Modal>
        </View>
      )}

      {/* Variant Selection Card */}
      {useInventorySelection &&
        selectedInventoryItem &&
        availableVariants.length > 0 && (
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="tune" size={24} color="#FF99CC" />
              <Text style={styles.cardTitle}>Chọn dung tích / kích thước</Text>
            </View>
            <Text style={styles.cardSubtitle}>
              Chọn các biến thể bạn muốn bán
            </Text>

            <View style={styles.variantGrid}>
              {availableVariants.map((variant) => {
                const isSelected = formData.variants.some(
                  (v) => v.variantId === variant.id
                );
                return (
                  <TouchableOpacity
                    key={variant.id}
                    style={[
                      styles.variantChip,
                      isSelected && styles.variantChipSelected,
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        removeSelectedVariant(variant.id);
                      } else {
                        handleVariantSelection(variant.id);
                      }
                    }}
                  >
                    <View style={styles.variantChipContent}>
                      <Text
                        style={[
                          styles.variantChipTitle,
                          isSelected && styles.variantChipTitleSelected,
                        ]}
                      >
                        {variant.name}
                      </Text>
                      <Text
                        style={[
                          styles.variantChipPrice,
                          isSelected && styles.variantChipPriceSelected,
                        ]}
                      >
                        {variant.price.toLocaleString("vi-VN")}đ
                      </Text>
                      <Text
                        style={[
                          styles.variantChipStock,
                          isSelected && styles.variantChipStockSelected,
                        ]}
                      >
                        Còn: {variant.stockQty}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <MaterialIcons name="check" size={16} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

      {/* Basic Information Card */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="info" size={24} color="#FF99CC" />
          <Text style={styles.cardTitle}>Thông tin cơ bản</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Tên sản phẩm *</Text>
          <TextInput
            style={[styles.modernInput, errors.title && styles.inputError]}
            value={formData.title}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, title: text }));
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            placeholder="Nhập tên sản phẩm..."
            multiline
            editable={!useInventorySelection || !selectedInventoryItem}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Mô tả sản phẩm *</Text>
          <TextInput
            style={[
              styles.modernTextArea,
              errors.description && styles.inputError,
            ]}
            value={formData.description}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, description: text }));
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            placeholder="Nhập mô tả chi tiết về sản phẩm..."
            multiline
            numberOfLines={4}
            editable={!useInventorySelection || !selectedInventoryItem}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <View style={styles.formRow}>
          <View style={styles.formGroupHalf}>
            <Text style={styles.inputLabel}>Danh mục *</Text>
            <View style={styles.modernPickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: value,
                    isFlashDeal: value === "FlashDeals",
                  }));
                }}
                style={styles.modernPicker}
              >
                <Picker.Item label="Sản phẩm mới" value="new_product" />
                <Picker.Item label="Flash Deal" value="FlashDeals" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroupHalf}>
            <Text style={styles.inputLabel}>Thương hiệu *</Text>
            <TextInput
              style={[styles.modernInput, errors.brand && styles.inputError]}
              value={formData.brand}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, brand: text }));
                setErrors((prev) => ({ ...prev, brand: "" }));
              }}
              placeholder="Tên thương hiệu..."
              editable={!useInventorySelection || !selectedInventoryItem}
            />
            {errors.brand && (
              <Text style={styles.errorText}>{errors.brand}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Image Upload Card */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="photo-camera" size={24} color="#FF99CC" />
          <Text style={styles.cardTitle}>Hình ảnh sản phẩm</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.modernImagePicker,
            errors.imageUrl && styles.inputError,
          ]}
          onPress={pickImage}
          disabled={
            imageUploading || (useInventorySelection && !!selectedInventoryItem)
          }
        >
          {imageUploading ? (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="large" color="#FF99CC" />
              <Text style={styles.imageLoadingText}>Đang tải ảnh...</Text>
            </View>
          ) : formData.imageUrl ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: formData.imageUrl }}
                style={styles.imagePreview}
              />
              <View style={styles.imageOverlay}>
                <MaterialIcons name="edit" size={24} color="#fff" />
                <Text style={styles.imageOverlayText}>Thay đổi</Text>
              </View>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="add-a-photo" size={48} color="#FF99CC" />
              <Text style={styles.imagePlaceholderTitle}>Thêm hình ảnh</Text>
              <Text style={styles.imagePlaceholderSubtitle}>
                Nhấn để chọn ảnh từ thư viện
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {errors.imageUrl && (
          <Text style={styles.errorText}>{errors.imageUrl}</Text>
        )}
        {useInventorySelection && selectedInventoryItem && (
          <Text style={styles.helperText}>
            💡 Ảnh được tự động lấy từ kho sản phẩm
          </Text>
        )}
      </View>

      {/* Variants Card */}
      {(!useInventorySelection || formData.variants.length > 0) && (
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="list" size={24} color="#FF99CC" />
            <Text style={styles.cardTitle}>
              {useInventorySelection ? "Biến thể đã chọn" : "Biến thể sản phẩm"}
            </Text>
            {!useInventorySelection && (
              <TouchableOpacity style={styles.addButton} onPress={addVariant}>
                <MaterialIcons name="add" size={20} color="#FF99CC" />
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
            )}
          </View>

          {formData.variants.map((variant, index) => (
            <View key={index} style={styles.variantCard}>
              <View style={styles.variantCardHeader}>
                <Text style={styles.variantCardTitle}>
                  {useInventorySelection
                    ? variant.size
                    : `Biến thể ${index + 1}`}
                </Text>
                {((!useInventorySelection && formData.variants.length > 1) ||
                  (useInventorySelection && variant.variantId)) && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      if (useInventorySelection && variant.variantId) {
                        removeSelectedVariant(variant.variantId);
                      } else {
                        removeVariant(index);
                      }
                    }}
                  >
                    <MaterialIcons name="delete" size={20} color="#ff4444" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.variantFormRow}>
                <View style={styles.variantFormGroup}>
                  <Text style={styles.variantLabel}>Kích thước *</Text>
                  <TextInput
                    style={[
                      styles.variantInput,
                      errors[`variant_${index}_size`] && styles.inputError,
                    ]}
                    value={variant.size}
                    onChangeText={(text) => updateVariant(index, "size", text)}
                    placeholder="50ml, 100g..."
                    editable={!useInventorySelection}
                  />
                  {errors[`variant_${index}_size`] && (
                    <Text style={styles.errorText}>
                      {errors[`variant_${index}_size`]}
                    </Text>
                  )}
                </View>

                <View style={styles.variantFormGroup}>
                  <Text style={styles.variantLabel}>Giá (VNĐ) *</Text>
                  <TextInput
                    style={[
                      styles.variantInput,
                      errors[`variant_${index}_price`] && styles.inputError,
                    ]}
                    value={variant.price}
                    onChangeText={(text) => updateVariant(index, "price", text)}
                    placeholder="120,000"
                    keyboardType="numeric"
                  />
                  {errors[`variant_${index}_price`] && (
                    <Text style={styles.errorText}>
                      {errors[`variant_${index}_price`]}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.variantFormRow}>
                <View style={styles.variantFormGroup}>
                  <Text style={styles.variantLabel}>Số lượng *</Text>
                  <TextInput
                    style={[
                      styles.variantInput,
                      errors[`variant_${index}_stock`] && styles.inputError,
                    ]}
                    value={variant.stock}
                    onChangeText={(text) => updateVariant(index, "stock", text)}
                    placeholder="10"
                    keyboardType="numeric"
                  />
                  {errors[`variant_${index}_stock`] && (
                    <Text style={styles.errorText}>
                      {errors[`variant_${index}_stock`]}
                    </Text>
                  )}
                </View>

                <View style={styles.variantFormGroup}>
                  <Text style={styles.variantLabel}>SKU</Text>
                  <TextInput
                    style={styles.variantInput}
                    value={variant.sku}
                    onChangeText={(text) => updateVariant(index, "sku", text)}
                    placeholder="SP001"
                    editable={!useInventorySelection}
                  />
                </View>
              </View>
            </View>
          ))}

          {errors.variants && (
            <Text style={styles.errorText}>{errors.variants}</Text>
          )}

          {useInventorySelection &&
            selectedInventoryItem &&
            formData.variants.length === 0 &&
            !errors.variants && (
              <View style={styles.emptyStateContainer}>
                <MaterialIcons name="info-outline" size={24} color="#FF99CC" />
                <Text style={styles.emptyStateText}>
                  Hãy chọn dung tích/kích thước từ danh sách bên trên để thêm
                  vào sản phẩm
                </Text>
              </View>
            )}
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.modernSubmitButton,
          isLoading && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.submitLoadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.submitButtonText}>Đang xử lý...</Text>
          </View>
        ) : (
          <View style={styles.submitButtonContent}>
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>{submitButtonText}</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },

  // Header Section
  headerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },

  // Card Container
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 8,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },

  // Modern Form Elements
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  formGroupHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  modernInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1f2937",
  },
  modernTextArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1f2937",
    minHeight: 120,
    textAlignVertical: "top",
  },
  modernPickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  modernPicker: {
    height: 56,
  },

  // Inventory Selection
  inventorySelector: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 80,
  },
  selectedItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  selectedItemBrand: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  selectedItemCount: {
    fontSize: 12,
    color: "#9ca3af",
  },
  placeholderContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },
  placeholderTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 2,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
  },

  // Variant Selection
  variantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  variantChip: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    minWidth: 140,
    position: "relative",
  },
  variantChipSelected: {
    borderColor: "#FF99CC",
    backgroundColor: "#fef7f7",
  },
  variantChipContent: {
    alignItems: "flex-start",
  },
  variantChipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  variantChipTitleSelected: {
    color: "#FF99CC",
  },
  variantChipPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#059669",
    marginBottom: 2,
  },
  variantChipPriceSelected: {
    color: "#FF99CC",
  },
  variantChipStock: {
    fontSize: 12,
    color: "#6b7280",
  },
  variantChipStockSelected: {
    color: "#FF99CC",
  },
  selectedBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF99CC",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  // Image Upload
  modernImagePicker: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  imageLoadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageLoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  imagePreviewContainer: {
    position: "relative",
    alignItems: "center",
  },
  imagePreview: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  imageOverlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 12,
    marginBottom: 4,
  },
  imagePlaceholderSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },

  // Add/Remove Buttons
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef7f7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF99CC",
  },
  addButtonText: {
    color: "#FF99CC",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#fef2f2",
  },

  // Variant Cards
  variantCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  variantCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  variantCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  variantFormRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  variantFormGroup: {
    flex: 1,
  },
  variantLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  variantInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#1f2937",
  },

  // Submit Button
  modernSubmitButton: {
    backgroundColor: "#FF99CC",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#FF99CC",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Empty State
  emptyStateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fef7f7",
    borderRadius: 12,
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
    textAlign: "center",
    flex: 1,
  },

  // Error & Helper Text
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
    lineHeight: 16,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 8,
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  modalLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  modalLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  inventoryList: {
    padding: 20,
  },
  inventoryItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inventoryItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  inventoryItemInfo: {
    flex: 1,
  },
  inventoryItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  inventoryItemSupplier: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  inventoryItemBrand: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  inventoryItemVariants: {
    fontSize: 12,
    color: "#9ca3af",
  },
  itemSeparator: {
    height: 12,
  },
  bottomSpacing: {
    height: 40,
  },

  // Legacy styles for backward compatibility
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  variantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addVariantButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF99CC",
  },
  addVariantText: {
    color: "#FF99CC",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  variantContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  variantTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  removeVariantButton: {
    padding: 4,
  },
  variantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  variantInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#FF99CC",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  variantSelectionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
