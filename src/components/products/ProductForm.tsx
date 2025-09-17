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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Product, ProductVariant } from "../../types/product";
import { uploadImage } from "../../services/cloudinary";

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (productData: any) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
}

interface FormVariant {
  size: string;
  price: string;
  stock: string;
  sku?: string;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  brand: string;
  imageUrl: string;
  variants: FormVariant[];
  isFlashDeal: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSubmit,
  isLoading = false,
  submitButtonText = "Lưu sản phẩm",
}) => {
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
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

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
      newErrors.variants = "Cần có ít nhất một biến thể sản phẩm";
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
      {/* Product Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tên sản phẩm *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={formData.title}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, title: text }));
            setErrors((prev) => ({ ...prev, title: "" }));
          }}
          placeholder="Nhập tên sản phẩm"
          multiline
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mô tả sản phẩm *</Text>
        <TextInput
          style={[styles.textArea, errors.description && styles.inputError]}
          value={formData.description}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, description: text }));
            setErrors((prev) => ({ ...prev, description: "" }));
          }}
          placeholder="Nhập mô tả chi tiết về sản phẩm"
          multiline
          numberOfLines={4}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description}</Text>
        )}
      </View>

      {/* Category */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Danh mục *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.category}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                category: value,
                isFlashDeal: value === "FlashDeals",
              }));
            }}
            style={styles.picker}
          >
            <Picker.Item label="Sản phẩm mới" value="new_product" />
            <Picker.Item label="Flash Deal" value="FlashDeals" />
          </Picker>
        </View>
      </View>

      {/* Brand */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Thương hiệu *</Text>
        <TextInput
          style={[styles.input, errors.brand && styles.inputError]}
          value={formData.brand}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, brand: text }));
            setErrors((prev) => ({ ...prev, brand: "" }));
          }}
          placeholder="Nhập tên thương hiệu"
        />
        {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
      </View>

      {/* Image */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hình ảnh sản phẩm *</Text>
        <TouchableOpacity
          style={[
            styles.imagePickerButton,
            errors.imageUrl && styles.inputError,
          ]}
          onPress={pickImage}
          disabled={imageUploading}
        >
          {imageUploading ? (
            <ActivityIndicator size="small" color="#FF99CC" />
          ) : formData.imageUrl ? (
            <Image
              source={{ uri: formData.imageUrl }}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="add-a-photo" size={40} color="#ccc" />
              <Text style={styles.imagePlaceholderText}>Chọn hình ảnh</Text>
            </View>
          )}
        </TouchableOpacity>
        {errors.imageUrl && (
          <Text style={styles.errorText}>{errors.imageUrl}</Text>
        )}
      </View>

      {/* Variants */}
      <View style={styles.inputGroup}>
        <View style={styles.variantHeader}>
          <Text style={styles.label}>Biến thể sản phẩm *</Text>
          <TouchableOpacity
            style={styles.addVariantButton}
            onPress={addVariant}
          >
            <MaterialIcons name="add" size={20} color="#FF99CC" />
            <Text style={styles.addVariantText}>Thêm biến thể</Text>
          </TouchableOpacity>
        </View>

        {formData.variants.map((variant, index) => (
          <View key={index} style={styles.variantContainer}>
            <View style={styles.variantHeader}>
              <Text style={styles.variantTitle}>Biến thể {index + 1}</Text>
              {formData.variants.length > 1 && (
                <TouchableOpacity
                  style={styles.removeVariantButton}
                  onPress={() => removeVariant(index)}
                >
                  <MaterialIcons name="close" size={20} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.variantRow}>
              <View style={styles.variantInputContainer}>
                <Text style={styles.variantLabel}>Kích thước *</Text>
                <TextInput
                  style={[
                    styles.variantInput,
                    errors[`variant_${index}_size`] && styles.inputError,
                  ]}
                  value={variant.size}
                  onChangeText={(text) => updateVariant(index, "size", text)}
                  placeholder="50ml, 100g..."
                />
                {errors[`variant_${index}_size`] && (
                  <Text style={styles.errorText}>
                    {errors[`variant_${index}_size`]}
                  </Text>
                )}
              </View>

              <View style={styles.variantInputContainer}>
                <Text style={styles.variantLabel}>Giá (VNĐ) *</Text>
                <TextInput
                  style={[
                    styles.variantInput,
                    errors[`variant_${index}_price`] && styles.inputError,
                  ]}
                  value={variant.price}
                  onChangeText={(text) => updateVariant(index, "price", text)}
                  placeholder="120000"
                  keyboardType="numeric"
                />
                {errors[`variant_${index}_price`] && (
                  <Text style={styles.errorText}>
                    {errors[`variant_${index}_price`]}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.variantRow}>
              <View style={styles.variantInputContainer}>
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

              <View style={styles.variantInputContainer}>
                <Text style={styles.variantLabel}>SKU</Text>
                <TextInput
                  style={styles.variantInput}
                  value={variant.sku}
                  onChangeText={(text) => updateVariant(index, "sku", text)}
                  placeholder="SP001"
                />
              </View>
            </View>
          </View>
        ))}
        {errors.variants && (
          <Text style={styles.errorText}>{errors.variants}</Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>{submitButtonText}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
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
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
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
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    color: "#ccc",
    marginTop: 8,
    fontSize: 14,
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
  variantLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  variantInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#FF99CC",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 40,
  },
});
