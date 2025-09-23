import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import {
  Notification,
  CreateNotificationData,
  UpdateNotificationData,
} from "../../types/notification";

interface NotificationFormProps {
  notification?: Notification;
  onSubmit: (data: CreateNotificationData | UpdateNotificationData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  notification,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [title, setTitle] = useState(notification?.title || "");
  const [content, setContent] = useState(notification?.content || "");
  const [important, setImportant] = useState(notification?.important ?? false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề thông báo");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung thông báo");
      return;
    }

    const formData = {
      title: title.trim(),
      content: content.trim(),
      important,
    };

    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {notification ? "Chỉnh sửa thông báo" : "Thêm thông báo mới"}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiêu đề thông báo *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Nhập tiêu đề thông báo"
              placeholderTextColor="#8F9BB3"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nội dung *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={content}
              onChangeText={setContent}
              placeholder="Nhập nội dung thông báo"
              placeholderTextColor="#8F9BB3"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Thông báo quan trọng</Text>
              <Switch
                value={important}
                onValueChange={setImportant}
                trackColor={{ false: "#E4E6EA", true: "#FF6B6B" }}
                thumbColor={important ? "#fff" : "#8F9BB3"}
              />
            </View>
            <Text style={styles.switchDescription}>
              {important
                ? "Thông báo sẽ được đánh dấu là quan trọng"
                : "Thông báo thường"}
            </Text>
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
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading
                ? "Đang xử lý..."
                : notification
                ? "Cập nhật"
                : "Tạo mới"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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
  textArea: {
    height: 120,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  switchDescription: {
    fontSize: 12,
    color: "#8F9BB3",
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

export default NotificationForm;
