import React, { useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchProducts } from "../../redux/slices/productSlice";
import { ProductList } from "../../components/products/ProductList";
import { FloatingActionButton } from "../../components/products/FloatingActionButton";
import { Product } from "../../types/product";

const Tab = createMaterialTopTabNavigator();

// Flash Deals Tab
const FlashDealsTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { flashDeals, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductPress = (product: Product) => {
    // Navigate to product detail
    console.log("Navigate to product detail:", product.id);
  };

  const handleEditProduct = (product: Product) => {
    // Navigate to edit product form
    console.log("Edit product:", product.id);
  };

  const handleDeleteProduct = (product: Product) => {
    // Show delete confirmation and delete product
    console.log("Delete product:", product.id);
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
  const dispatch = useDispatch<AppDispatch>();
  const { newProducts, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductPress = (product: Product) => {
    // Navigate to product detail
    console.log("Navigate to product detail:", product.id);
  };

  const handleEditProduct = (product: Product) => {
    // Navigate to edit product form
    console.log("Edit product:", product.id);
  };

  const handleDeleteProduct = (product: Product) => {
    // Show delete confirmation and delete product
    console.log("Delete product:", product.id);
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
  const handleAddProduct = () => {
    // Navigate to add product form
    console.log("Navigate to add product form");
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
    backgroundColor: "#f8f9fa",
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
