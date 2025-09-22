import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchCategories,
  deleteCategory,
  clearError,
} from "../../redux/slices/categorySlice";
import { Category } from "../../types/category";
import { CategoryList } from "../../components/categories";
import { PlusIcon, ArrowLeftIcon } from "../../components/common/icons";

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchCategories());
    setRefreshing(false);
  };

  const handleEdit = (category: Category) => {
    (navigation as any).navigate("EditCategory", { category });
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      Alert.alert("Thành công", "Danh mục đã được xóa");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa danh mục");
    }
  };

  const handleAddCategory = () => {
    (navigation as any).navigate("AddCategory");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={24} color="#2E3A59" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Quản lý danh mục</Text>
          <Text style={styles.subtitle}>{categories.length} danh mục</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <PlusIcon size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <CategoryList
          categories={categories}
          loading={loading}
          onRefresh={handleRefresh}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6EA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#8F9BB3",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6C5CE7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flex: 1,
  },
});
