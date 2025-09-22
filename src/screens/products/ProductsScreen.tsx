import React, { useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchProducts, deleteProduct } from "../../redux/slices/productSlice";
import { ProductList } from "../../components/products/ProductList";
import { FloatingActionButton } from "../../components/products/FloatingActionButton";
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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

  return (
    <View style={styles.tabContainer}>
      <ProductList
        products={flashDeals}
        onProductPress={handleProductPress}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
        onRefresh={handleRefresh}
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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

  return (
    <View style={styles.tabContainer}>
      <ProductList
        products={newProducts}
        onProductPress={handleProductPress}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
        onRefresh={handleRefresh}
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
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarActiveTintColor: "#FF99CC",
          tabBarInactiveTintColor: "#666",
        }}
      >
        <Tab.Screen
          name="FlashDeals"
          component={FlashDealsTab}
          options={{ title: "Flash Deal" }}
        />
        <Tab.Screen
          name="NewProducts"
          component={NewProductsTab}
          options={{ title: "Sản phẩm mới" }}
        />
      </Tab.Navigator>

      <FloatingActionButton onPress={handleAddProduct} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  tabContainer: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "none",
  },
  tabBarIndicator: {
    backgroundColor: "#FF99CC",
    height: 3,
  },
});
