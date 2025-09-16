import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { deleteProduct } from "../../redux/slices/productSlice";
import { Product, ProductVariant } from "../../types/product";
import { Ionicons } from "@expo/vector-icons";

interface ProductDetailScreenProps {
  product: Product;
  onEdit: (product: Product) => void;
  onBack: () => void;
}

const { width } = Dimensions.get("window");

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onEdit,
  onBack,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.products);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleDelete = () => {
    Alert.alert("Xóa sản phẩm", "Bạn có chắc chắn muốn xóa sản phẩm này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          dispatch(deleteProduct(product.id));
          onBack();
        },
      },
    ]);
  };

  const handleEdit = () => {
    onEdit(product);
  };

  const getTotalStock = () => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce(
      (total, variant) => total + variant.stock,
      0
    );
  };

  const isFlashDeal =
    product.isFlashDeal &&
    product.flashDealEndTime &&
    product.flashDealEndTime > Date.now();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#FF99CC" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
          {isFlashDeal && (
            <View style={styles.flashDealBadge}>
              <Text style={styles.flashDealText}>Flash Deal</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.category}>Danh mục: {product.category}</Text>

          <Text style={styles.description}>{product.description}</Text>

          {/* Price Range */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Giá:</Text>
            {product.variants && product.variants.length > 0 ? (
              <View style={styles.priceRange}>
                <Text style={styles.price}>
                  {formatPrice(
                    Math.min(...product.variants.map((v) => v.price))
                  )}
                </Text>
                {product.variants.length > 1 && (
                  <>
                    <Text style={styles.priceSeparator}> - </Text>
                    <Text style={styles.price}>
                      {formatPrice(
                        Math.max(...product.variants.map((v) => v.price))
                      )}
                    </Text>
                  </>
                )}
              </View>
            ) : (
              <Text style={styles.noPrice}>Chưa có giá</Text>
            )}
          </View>

          {/* Stock Info */}
          <View style={styles.stockContainer}>
            <Text style={styles.stockLabel}>Tổng tồn kho:</Text>
            <Text style={styles.stockValue}>{getTotalStock()} sản phẩm</Text>
          </View>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <View style={styles.variantsContainer}>
              <Text style={styles.variantsTitle}>Các loại sản phẩm:</Text>
              {product.variants.map((variant, index) => (
                <TouchableOpacity
                  key={variant.id || index}
                  style={[
                    styles.variantItem,
                    selectedVariant?.id === variant.id &&
                      styles.selectedVariant,
                  ]}
                  onPress={() => setSelectedVariant(variant)}
                >
                  <View style={styles.variantInfo}>
                    <Text style={styles.variantSize}>{variant.size}</Text>
                    <Text style={styles.variantPrice}>
                      {formatPrice(variant.price)}
                    </Text>
                  </View>
                  <Text style={styles.variantStock}>Còn: {variant.stock}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Selected Variant Details */}
          {selectedVariant && (
            <View style={styles.selectedVariantContainer}>
              <Text style={styles.selectedVariantTitle}>
                Thông tin chi tiết:
              </Text>
              <View style={styles.selectedVariantInfo}>
                <Text style={styles.selectedVariantText}>
                  Dung tích: {selectedVariant.size}
                </Text>
                <Text style={styles.selectedVariantText}>
                  Giá: {formatPrice(selectedVariant.price)}
                </Text>
                <Text style={styles.selectedVariantText}>
                  Tồn kho: {selectedVariant.stock}
                </Text>
                {selectedVariant.sku && (
                  <Text style={styles.selectedVariantText}>
                    SKU: {selectedVariant.sku}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Timestamps */}
          <View style={styles.timestampsContainer}>
            <Text style={styles.timestampText}>
              Tạo: {new Date(product.createdAt).toLocaleDateString("vi-VN")}
            </Text>
            <Text style={styles.timestampText}>
              Cập nhật:{" "}
              {new Date(product.updatedAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editActionButton]}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteActionButton]}
          onPress={handleDelete}
          disabled={loading}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: width * 0.8,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  flashDealBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  flashDealText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  priceRange: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF99CC",
  },
  priceSeparator: {
    fontSize: 16,
    color: "#666",
  },
  noPrice: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stockLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  stockValue: {
    fontSize: 16,
    color: "#666",
  },
  variantsContainer: {
    marginBottom: 16,
  },
  variantsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  variantItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedVariant: {
    borderColor: "#FF99CC",
    backgroundColor: "#fff5f8",
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
  selectedVariantContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedVariantTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  selectedVariantInfo: {
    gap: 4,
  },
  selectedVariantText: {
    fontSize: 14,
    color: "#555",
  },
  timestampsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingTop: 12,
    gap: 4,
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
  },
  actionContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  editActionButton: {
    backgroundColor: "#FF99CC",
  },
  deleteActionButton: {
    backgroundColor: "#dc3545",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
