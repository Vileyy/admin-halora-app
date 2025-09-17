import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { ProductForm } from "../../components/products/ProductForm";
import { updateProduct } from "../../redux/slices/productSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { RootStackParamList } from "../../navigation/types";
import { Product } from "../../types/product";
import { ProductService } from "../../services/productService";

type EditProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditProductScreen"
>;

type EditProductScreenRouteProp = RouteProp<
  RootStackParamList,
  "EditProductScreen"
>;

export default function EditProductScreen() {
  const navigation = useNavigation<EditProductScreenNavigationProp>();
  const route = useRoute<EditProductScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.products);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const { productId } = route.params;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoadingProduct(true);
      const result = await ProductService.getProductById(productId);
      
      if (result.success && result.data) {
        setProduct(result.data);
      } else {
        Alert.alert(
          "Lỗi",
          "Không thể tải thông tin sản phẩm",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Có lỗi xảy ra khi tải sản phẩm",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleSubmit = async (productData: any) => {
    try {
      const result = await dispatch(
        updateProduct({ id: productId, updates: productData })
      );
      
      if (updateProduct.fulfilled.match(result)) {
        Alert.alert(
          "Thành công",
          "Sản phẩm đã được cập nhật thành công!",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Lỗi",
          result.payload as string || "Có lỗi xảy ra khi cập nhật sản phẩm"
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật sản phẩm");
    }
  };

  if (loadingProduct) {
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
      <ProductForm
        initialProduct={product}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitButtonText="Cập nhật sản phẩm"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
});
