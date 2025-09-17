import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../navigation/types";
import { Product } from "../../types/product";
import { ProductService } from "../../services/productService";

type ProductDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProductDetailScreen"
>;

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProductDetailScreen"
>;

export default function ProductDetailScreen() {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { productId } = route.params;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const result = await ProductService.getProductById(productId);

      if (result.success && result.data) {
        setProduct(result.data);
      } else {
        Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải sản phẩm", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = () => {
    navigation.navigate("EditProductScreen", { productId });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF99CC" />
        <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
          />
          {product.isFlashDeal && (
            <View style={styles.flashDealBadge}>
              <Text style={styles.flashDealText}>FLASH DEAL</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>
          <Text style={styles.productCategory}>{product.category}</Text>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
          </View>

          {/* Variants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Các biến thể</Text>
            {product.variants.map((variant, index) => (
              <View key={variant.id} style={styles.variantCard}>
                <View style={styles.variantInfo}>
                  <Text style={styles.variantSize}>
                    Kích thước: {variant.size}
                  </Text>
                  <Text style={styles.variantPrice}>
                    {formatPrice(variant.price)}
                  </Text>
                </View>
                <View style={styles.variantStock}>
                  <Text style={styles.stockLabel}>Còn lại:</Text>
                  <Text
                    style={[
                      styles.stockValue,
                      variant.stock <= 5 ? styles.lowStock : styles.inStock,
                    ]}
                  >
                    {variant.stock}
                  </Text>
                </View>
                {variant.sku && (
                  <Text style={styles.variantSku}>SKU: {variant.sku}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Product Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin thêm</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Tổng số lượng:</Text>
                <Text style={styles.statValue}>
                  {product.variants.reduce(
                    (total, variant) => total + variant.stock,
                    0
                  )}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Giá thấp nhất:</Text>
                <Text style={styles.statValue}>
                  {formatPrice(
                    Math.min(...product.variants.map((v) => v.price))
                  )}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Giá cao nhất:</Text>
                <Text style={styles.statValue}>
                  {formatPrice(
                    Math.max(...product.variants.map((v) => v.price))
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={handleEditProduct}>
        <MaterialIcons name="edit" size={24} color="#fff" />
        <Text style={styles.editButtonText}>Chỉnh sửa</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
  },
  imageContainer: {
    position: "relative",
    height: 300,
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  flashDealBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  flashDealText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 16,
    color: "#FF99CC",
    fontWeight: "600",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  variantCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  variantInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  variantSize: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  variantPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF99CC",
  },
  variantStock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  stockLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  lowStock: {
    color: "#ff4444",
  },
  inStock: {
    color: "#28a745",
  },
  variantSku: {
    fontSize: 12,
    color: "#999",
  },
  statsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  editButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF99CC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
