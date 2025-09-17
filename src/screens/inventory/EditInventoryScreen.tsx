import React, { useEffect, useState } from "react";
import { Alert, ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  updateInventory,
  fetchInventory,
} from "../../redux/slices/inventorySlice";
import { InventoryForm } from "../../components/inventory/InventoryForm";
import { InventoryItem } from "../../types/inventory";

interface EditInventoryScreenRouteProp {
  params: {
    id: string;
  };
}

export default function EditInventoryScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditInventoryScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.inventory);

  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const { id } = route.params;

  useEffect(() => {
    const loadItem = async () => {
      try {
        // First try to find the item in current state
        let item = items.find((item) => item.id === id);

        // If not found, fetch all items (might be stale data)
        if (!item) {
          await dispatch(fetchInventory()).unwrap();
          const updatedItems = items.find((item) => item.id === id);
          item = updatedItems;
        }

        if (item) {
          setCurrentItem(item);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy sản phẩm", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } finally {
        setInitialLoading(false);
      }
    };

    loadItem();
  }, [id, dispatch, navigation, items]);

  const handleSubmit = async (itemData: Partial<InventoryItem>) => {
    try {
      await dispatch(updateInventory({ id, data: itemData })).unwrap();
      Alert.alert("Thành công", "Đã cập nhật thông tin sản phẩm!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật sản phẩm");
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF99CC" />
        <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
      </SafeAreaView>
    );
  }

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <InventoryForm
        initialItem={currentItem}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitButtonText="Cập nhật sản phẩm"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8F9BB3",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },
  errorText: {
    fontSize: 18,
    color: "#FF6B6B",
    textAlign: "center",
  },
});
