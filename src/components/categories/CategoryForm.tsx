import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../../types/category";
import { pickAndUploadImage } from "../../services/cloudinary";

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryData | UpdateCategoryData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CategoryForm({
  category,
  onSubmit,
  onCancel,
  loading = false,
}: CategoryFormProps) {
  const [title, setTitle] = useState(category?.title || "");
  const [image, setImage] = useState(category?.image || "");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    try {
      setUploading(true);
      const result = await pickAndUploadImage("halora-categories");
      if (result) {
        setImage(result);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải lên hình ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên danh mục");
      return;
    }

    if (!image.trim()) {
      Alert.alert("Lỗi", "Vui lòng chọn hình ảnh cho danh mục");
      return;
    }

    const formData = {
      title: title.trim(),
      image: image.trim(),
    };

    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên danh mục *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Nhập tên danh mục"
              placeholderTextColor="#8F9BB3"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hình ảnh *</Text>
            <TouchableOpacity
              style={styles.imageUpload}
              onPress={handleImageUpload}
              disabled={uploading}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadText}>
                    {uploading ? "Đang tải lên..." : "Chọn hình ảnh"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading || uploading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Đang xử lý..." : category ? "Cập nhật" : "Tạo mới"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E3A59",
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E4E6EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2E3A59",
    backgroundColor: "#F7F9FC",
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: "#E4E6EA",
    borderStyle: "dashed",
    borderRadius: 12,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: 14,
    color: "#8F9BB3",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F7F9FC",
    borderWidth: 1,
    borderColor: "#E4E6EA",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8F9BB3",
  },
  submitButton: {
    backgroundColor: "#6C5CE7",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
