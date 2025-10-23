import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InventoryItem } from "../../types/inventory";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { productStockService } from "../../services/productStockService";

interface InventoryCardProps {
  item: InventoryItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const { brands } = useSelector((state: RootState) => state.brands);
  const [productStock, setProductStock] = useState<{
    totalStock: number;
    variants: Array<{
      size: string;
      stockQty: number;
      price: number;
    }>;
  } | null>(null);
  const [loadingStock, setLoadingStock] = useState(true);

  const getBrandName = () => {
    const brand = brands.find((b) => b.id === item.brandId);
    return brand?.name || "Chưa có thương hiệu";
  };

  useEffect(() => {
    loadProductStock();
  }, [item.id]);

  const loadProductStock = async () => {
    try {
      setLoadingStock(true);
      const stock = await productStockService.getProductStockByInventoryId(
        item.id
      );
      setProductStock(stock);
    } catch (error) {
      console.error("Error loading product stock:", error);
      setProductStock(null);
    } finally {
      setLoadingStock(false);
    }
  };
  const handleDelete = () => {
    Alert.alert(
      "Xóa sản phẩm",
      `Bạn có chắc chắn muốn xóa "${item.name}" khỏi kho?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => onDelete(item.id),
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getTotalStock = () => {
    // Sử dụng tồn kho từ products nếu có, nếu không thì dùng từ inventory
    if (productStock) {
      return productStock.totalStock;
    }
    return item.variants.reduce(
      (total, variant) => total + variant.stockQty,
      0
    );
  };

  const getStockStatus = () => {
    const totalStock = getTotalStock();
    if (totalStock === 0) {
      return {
        status: "out",
        text: "Hết hàng",
        color: "#FF6B6B",
        bgColor: "#FFE5E5",
      };
    } else if (totalStock <= 5) {
      return {
        status: "low",
        text: "Sắp hết",
        color: "#FF9500",
        bgColor: "#FFF4E5",
      };
    } else {
      return {
        status: "available",
        text: "Còn hàng",
        color: "#34C759",
        bgColor: "#E5F7E5",
      };
    }
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case "out":
        return "close-circle";
      case "low":
        return "warning";
      case "available":
        return "checkmark-circle";
      default:
        return "help-circle";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with image and basic info */}
      <View style={styles.header}>
        <Image
          source={{
            uri: item.media?.[0]?.url
              ? String(item.media[0].url)
              : "https://via.placeholder.com/80x80",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.basicInfo}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.supplier}>{item.supplier}</Text>
          <Text style={styles.brand}>{getBrandName()}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.stockInfo}>
            <View style={styles.stockStatusContainer}>
              {loadingStock ? (
                <Ionicons name="hourglass" size={16} color="#8F9BB3" />
              ) : (
                <Ionicons
                  name={getStockIcon(getStockStatus().status)}
                  size={16}
                  color={getStockStatus().color}
                />
              )}
              <Text
                style={[styles.stockText, { color: getStockStatus().color }]}
              >
                {loadingStock
                  ? "Đang tải..."
                  : `${getStockStatus().text} - ${getTotalStock()} sản phẩm`}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(item.id)}
          >
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Variants section */}
      {item.variants && item.variants.length > 0 && (
        <View style={styles.variantsSection}>
          <Text style={styles.variantsTitle}>
            Biến thể sản phẩm{" "}
            {productStock ? "(Tồn kho thực tế)" : "(Tồn kho ban đầu)"}:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.variantsScroll}
          >
            {item.variants.map((variant, index) => {
              // Tìm tồn kho thực tế từ products
              const actualStock = productStock?.variants.find(
                (pv) => pv.size === variant.name
              );
              const stockQty = actualStock
                ? actualStock.stockQty
                : variant.stockQty;
              const sellingPrice = actualStock
                ? actualStock.price
                : variant.price;

              return (
                <View key={variant.id} style={styles.variantCard}>
                  <Text style={styles.variantName}>{variant.name}</Text>
                  <View style={styles.variantInfo}>
                    <Text style={styles.variantLabel}>Giá nhập:</Text>
                    <Text style={styles.variantValue}>
                      {formatCurrency(variant.importPrice)}
                    </Text>
                  </View>
                  <View style={styles.variantInfo}>
                    <Text style={styles.variantLabel}>Giá bán:</Text>
                    <Text style={styles.variantValue}>
                      {formatCurrency(sellingPrice)}
                    </Text>
                  </View>
                  <View style={styles.variantInfo}>
                    <Text style={styles.variantLabel}>
                      {actualStock ? "Tồn kho thực tế:" : "Tồn kho ban đầu:"}
                    </Text>
                    <View style={styles.stockValueContainer}>
                      <Ionicons
                        name={
                          stockQty === 0
                            ? "close-circle"
                            : stockQty <= 5
                            ? "warning"
                            : "checkmark-circle"
                        }
                        size={12}
                        color={
                          stockQty === 0
                            ? "#FF6B6B"
                            : stockQty <= 5
                            ? "#FF9500"
                            : "#34C759"
                        }
                      />
                      <Text
                        style={[
                          styles.variantValue,
                          stockQty === 0 && styles.outOfStock,
                          stockQty > 0 && stockQty <= 5 && styles.lowStock,
                          stockQty > 5 && styles.inStock,
                        ]}
                      >
                        {stockQty}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Footer with timestamps */}
      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          Tạo: {new Date(item.createdAt).toLocaleDateString("vi-VN")}
        </Text>
        <Text style={styles.timestamp}>
          Cập nhật: {new Date(item.updatedAt).toLocaleDateString("vi-VN")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  basicInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 4,
  },
  supplier: {
    fontSize: 14,
    color: "#FF99CC",
    fontWeight: "600",
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: "#6C5CE7",
    fontWeight: "500",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#8F9BB3",
    lineHeight: 16,
    marginBottom: 8,
  },
  stockInfo: {
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  stockStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  actions: {
    justifyContent: "space-between",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#FF99CC",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
  },
  variantsSection: {
    marginBottom: 16,
  },
  variantsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 8,
  },
  variantsScroll: {
    flexDirection: "row",
  },
  variantCard: {
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    borderLeftWidth: 3,
    borderLeftColor: "#FF99CC",
  },
  variantName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 8,
    textAlign: "center",
  },
  variantInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  variantLabel: {
    fontSize: 11,
    color: "#8F9BB3",
  },
  variantValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2E3A59",
  },
  stockValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  outOfStock: {
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  lowStock: {
    color: "#FF9500",
    fontWeight: "bold",
  },
  inStock: {
    color: "#34C759",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F3F4",
  },
  timestamp: {
    fontSize: 10,
    color: "#8F9BB3",
  },
});
