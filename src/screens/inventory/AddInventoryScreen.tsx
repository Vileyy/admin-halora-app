import React from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { addInventory } from "../../redux/slices/inventorySlice";
import { InventoryForm } from "../../components/inventory/InventoryForm";
import { InventoryItem } from "../../types/inventory";

export default function AddInventoryScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.inventory);

  const handleSubmit = async (
    itemData: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await dispatch(addInventory(itemData)).unwrap();
      Alert.alert("Thành công", "Đã thêm sản phẩm vào kho thành công!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể thêm sản phẩm vào kho");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <InventoryForm
        onSubmit={handleSubmit}
        isLoading={loading}
        submitButtonText="Thêm vào kho"
      />
    </SafeAreaView>
  );
}
