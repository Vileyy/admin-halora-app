import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchProducts, deleteProduct } from "../../redux/slices/productSlice";
import { ProductList } from "../../components/products/ProductList";
import { SearchBar } from "../../components/products/SearchBar";
import { Product } from "../../types/product";
import { RootStackParamList } from "../../navigation/types";

const Tab = createMaterialTopTabNavigator();

type ProductsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Main"
>;

const FlashDealsTab = () => {
  const navigation = useNavigation<ProductsScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { flashDeals, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products based on search only
  const filteredProducts = useMemo(() => {
    return flashDeals.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [flashDeals, searchQuery]);

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetailScreen", { productId: product.id });
  };

  const handleEditProduct = (product: Product) => {
    navigation.navigate("EditProductScreen", { productId: product.id });
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa sản phẩm "${product.title}"?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await dispatch(deleteProduct(product.id));
              if (deleteProduct.fulfilled.match(result)) {
                Alert.alert("Thành công", "Sản phẩm đã được xóa thành công!");
              } else {
                Alert.alert(
                  "Lỗi",
                  (result.payload as string) || "Có lỗi xảy ra khi xóa sản phẩm"
                );
              }
            } catch (error) {
              Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa sản phẩm");
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={styles.tabContainer}>
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClearSearch}
        value={searchQuery}
        placeholder="Tìm kiếm flash deal..."
      />

      <ProductList
        products={filteredProducts}
        onProductPress={handleProductPress}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
        totalCount={flashDeals.length}
      />
    </View>
  );
};

// New Products Tab
const NewProductsTab = () => {
  const navigation = useNavigation<ProductsScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { newProducts, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products based on search only
  const filteredProducts = useMemo(() => {
    return newProducts.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [newProducts, searchQuery]);

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetailScreen", { productId: product.id });
  };

  const handleEditProduct = (product: Product) => {
    navigation.navigate("EditProductScreen", { productId: product.id });
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa sản phẩm "${product.title}"?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await dispatch(deleteProduct(product.id));
              if (deleteProduct.fulfilled.match(result)) {
                Alert.alert("Thành công", "Sản phẩm đã được xóa thành công!");
              } else {
                Alert.alert(
                  "Lỗi",
                  (result.payload as string) || "Có lỗi xảy ra khi xóa sản phẩm"
                );
              }
            } catch (error) {
              Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa sản phẩm");
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    dispatch(fetchProducts());
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={styles.tabContainer}>
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClearSearch}
        value={searchQuery}
        placeholder="Tìm kiếm sản phẩm mới..."
      />

      <ProductList
        products={filteredProducts}
        onProductPress={handleProductPress}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
        totalCount={newProducts.length}
      />
    </View>
  );
};

export default function ProductsScreen() {
  const navigation = useNavigation<ProductsScreenNavigationProp>();

  const handleAddProduct = () => {
    navigation.navigate("AddProductScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>
            <Text style={styles.headerSubtitle}>
              Danh sách sản phẩm của bạn
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAddProduct}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarActiveTintColor: "#FF99CC",
          tabBarInactiveTintColor: "#666",
          tabBarPressColor: "transparent",
        }}
      >
        <Tab.Screen
          name="FlashDeals"
          component={FlashDealsTab}
          options={{
            title: "Flash Deal",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "flash" : "flash-outline"}
                size={20}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="NewProducts"
          component={NewProductsTab}
          options={{
            title: "Sản phẩm mới",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "star" : "star-outline"}
                size={20}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 2,
  },
  headerButton: {
    backgroundColor: "#FF99CC",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF99CC",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabContainer: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "none",
    marginTop: 4,
  },
  tabBarIndicator: {
    backgroundColor: "#FF99CC",
    height: 3,
    borderRadius: 2,
  },
});
