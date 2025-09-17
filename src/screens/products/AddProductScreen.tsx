import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { ProductForm } from "../../components/products/ProductForm";
import { addProduct } from "../../redux/slices/productSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { RootStackParamList } from "../../navigation/types";

type AddProductScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddProductScreen"
>;

export default function AddProductScreen() {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.products);

  const handleSubmit = async (productData: any) => {
    try {
      const result = await dispatch(addProduct(productData));
      
      if (addProduct.fulfilled.match(result)) {
        Alert.alert(
          "Thành công",
          "Sản phẩm đã được thêm thành công!",
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
          result.payload as string || "Có lỗi xảy ra khi thêm sản phẩm"
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm sản phẩm");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProductForm
        onSubmit={handleSubmit}
        isLoading={loading}
        submitButtonText="Thêm sản phẩm"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});
