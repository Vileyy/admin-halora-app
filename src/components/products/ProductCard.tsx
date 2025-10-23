import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Product } from "../../types/product";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 columns with 16px margin each side + 16px gap between cards

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
  onDelete,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getLowestPrice = () => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.min(...product.variants.map((v) => v.price));
  };

  const getHighestPrice = () => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.max(...product.variants.map((v) => v.price));
  };

  const getTotalStock = () => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      {/* Product Image with Gradient Overlay */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)"]}
          style={styles.imageGradient}
        />

        {/* Flash Deal Badge */}
        {product.isFlashDeal && (
          <View style={styles.flashBadge}>
            <Text style={styles.flashBadgeText}>FLASH DEAL</Text>
          </View>
        )}

        {/* Stock Status */}
        <View style={styles.stockBadge}>
          <Ionicons
            name={getTotalStock() > 0 ? "checkmark-circle" : "close-circle"}
            size={16}
            color={getTotalStock() > 0 ? "#4CAF50" : "#F44336"}
          />
          <Text
            style={[
              styles.stockText,
              { color: getTotalStock() > 0 ? "#4CAF50" : "#F44336" },
            ]}
          >
            {getTotalStock()} sản phẩm
          </Text>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        {/* Title and Category */}
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {product.category} • {product.brand}
          </Text>
        </View>

        {/* Price Range */}
        <View style={styles.priceSection}>
          {product.variants && product.variants.length > 0 && (
            <View style={styles.priceContainer}>
              {getLowestPrice() === getHighestPrice() ? (
                <Text style={styles.priceText}>
                  {formatPrice(getLowestPrice())}
                </Text>
              ) : (
                <View style={styles.priceRange}>
                  <Text style={styles.priceText}>
                    {formatPrice(getLowestPrice())}
                  </Text>
                  <Text style={styles.priceSeparator}> - </Text>
                  <Text style={styles.priceText}>
                    {formatPrice(getHighestPrice())}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Variants Preview */}
        {product.variants && product.variants.length > 0 && (
          <View style={styles.variantsPreview}>
            {product.variants.slice(0, 2).map((variant, index) => (
              <View key={index} style={styles.variantChip}>
                <Text style={styles.variantSize}>{variant.size}ml</Text>
                <Text style={styles.variantPrice}>
                  {formatPrice(variant.price)}
                </Text>
              </View>
            ))}
            {product.variants.length > 2 && (
              <View style={styles.moreVariantsChip}>
                <Text style={styles.moreVariantsText}>
                  +{product.variants.length - 2}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit?.(product)}
          >
            <Ionicons name="create-outline" size={18} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete?.(product)}
          >
            <Ionicons name="trash-outline" size={18} color="#FF4757" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: cardWidth * 0.8,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  flashBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  flashBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  stockBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stockText: {
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 12,
  },
  titleSection: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  category: {
    fontSize: 12,
    color: "#8e8e93",
    fontWeight: "500",
  },
  priceSection: {
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FF6B9D",
    letterSpacing: 0.3,
  },
  priceRange: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceSeparator: {
    fontSize: 14,
    color: "#8e8e93",
    fontWeight: "600",
    marginHorizontal: 2,
  },
  variantsPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  variantChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  variantSize: {
    fontSize: 11,
    color: "#6c757d",
    fontWeight: "600",
    marginRight: 4,
  },
  variantPrice: {
    fontSize: 11,
    color: "#FF6B9D",
    fontWeight: "700",
  },
  moreVariantsChip: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreVariantsText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
