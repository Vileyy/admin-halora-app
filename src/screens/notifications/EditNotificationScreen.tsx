import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateNotification } from "../../redux/slices/notificationSlice";
import { Notification, UpdateNotificationData } from "../../types/notification";
import NotificationForm from "../../components/notifications/NotificationForm";
import { ArrowLeftIcon } from "../../components/common/icons";

interface RouteParams {
  notification: Notification;
}

export default function EditNotificationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const { notification } = route.params as RouteParams;

  const handleSubmit = async (data: UpdateNotificationData) => {
    try {
      setLoading(true);
      await dispatch(
        updateNotification({ id: notification.id, data })
      ).unwrap();
      Alert.alert("Thành công", "Thông báo đã được cập nhật", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông báo");
    } finally {
      setLoading(false);
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
        <View style={styles.headerContent}>
          <Text style={styles.title}>Chỉnh sửa thông báo</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <NotificationForm
          notification={notification}
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
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E3A59",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
});
