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
import { createBrand, clearError } from "../../redux/slices/brandSlice";
import { CreateBrandData } from "../../types/brand";
import { BrandForm } from "../../components/brands";
import { ArrowLeftIcon } from "../../components/common/icons";

export default function AddBrandScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.brands);

  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (data: CreateBrandData) => {
    try {
      await dispatch(createBrand(data)).unwrap();
      Alert.alert("Thành công", "Thương hiệu đã được tạo thành công", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo thương hiệu");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
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

        <Text style={styles.title}>Thêm thương hiệu mới</Text>

        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <BrandForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E3A59",
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
});
