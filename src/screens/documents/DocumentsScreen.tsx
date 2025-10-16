import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
  setUploadProgress,
  resetUploadProgress,
} from "../../redux/slices/documentSlice";
import { DocumentList, DocumentForm } from "../../components/documents";
import { Document, DocumentUploadRequest } from "../../types/document";

export default function DocumentsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, uploading, uploadProgress, error } = useSelector(
    (state: RootState) => state.documents
  );

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sort documents by uploadedAt (newest first)
  const sortedDocuments = React.useMemo(() => {
    return [...documents].sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime();
      const dateB = new Date(b.uploadedAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [documents]);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDocuments());
    setRefreshing(false);
  };

  const handleUploadDocument = async (uploadRequest: DocumentUploadRequest) => {
    try {
      // Reset progress before starting
      dispatch(resetUploadProgress());

      // Simulate progress updates
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        if (currentProgress <= 90) {
          dispatch(setUploadProgress(currentProgress));
        }
      }, 200);

      const result = await dispatch(uploadDocument(uploadRequest));

      clearInterval(progressInterval);
      dispatch(setUploadProgress(100));

      if (uploadDocument.fulfilled.match(result)) {
        Alert.alert("Thành công", "Upload tài liệu thành công!");
        setShowUploadModal(false);
        dispatch(resetUploadProgress());
      } else {
        const errorMessage =
          (result.payload as string) || "Có lỗi xảy ra khi upload tài liệu";
        Alert.alert("Lỗi Upload", errorMessage);
        dispatch(resetUploadProgress());
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi upload tài liệu");
      dispatch(resetUploadProgress());
    }
  };

  const handleDeleteDocument = async (document: Document) => {
    try {
      const result = await dispatch(deleteDocument(document.id));
      if (deleteDocument.fulfilled.match(result)) {
        Alert.alert("Thành công", "Tài liệu đã được xóa thành công!");
      } else {
        Alert.alert(
          "Lỗi",
          (result.payload as string) || "Có lỗi xảy ra khi xóa tài liệu"
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa tài liệu");
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "certificate":
        return "Chứng chỉ";
      case "inspection_certificate":
        return "Kiểm định";
      case "other":
        return "Khác";
      default:
        return "Khác";
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case "product_certificate":
        return "Chứng chỉ sản phẩm";
      case "inspection_report":
        return "Báo cáo kiểm định";
      case "quality_assurance":
        return "Đảm bảo chất lượng";
      case "safety_certificate":
        return "Giấy kiểm định an toàn mỹ phẩm";
      case "compliance_document":
        return "Tuân thủ và chính sách";
      case "other":
        return "Khác";
      default:
        return "Khác";
    }
  };

  const handleDocumentPress = (document: Document) => {
    // Navigate to document detail or open document
    Alert.alert(
      "Tài liệu",
      `Tên: ${document.name}\nLoại: ${getTypeLabel(
        document.type
      )}\nDanh mục: ${getCategoryLabel(document.category)}`,
      [
        { text: "Đóng", style: "cancel" },
        {
          text: "Mở",
          onPress: () => {
            // Open document logic here
            Alert.alert("Thông báo", "Chức năng mở tài liệu sẽ được tích hợp");
          },
        },
      ]
    );
  };

  const handleEditDocument = (document: Document) => {
    // Navigate to edit screen
    Alert.alert("Thông báo", "Chức năng chỉnh sửa sẽ được tích hợp");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="document-text-outline" size={24} color="#FF99CC" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Quản Lý Tài Liệu</Text>
            <Text style={styles.headerSubtitle}>
              Upload và quản lý tài liệu, chứng chỉ
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          <Ionicons name="refresh-outline" size={20} color="#FF99CC" />
        </TouchableOpacity>
      </View>

      {/* Document List */}
      <View style={styles.content}>
        <DocumentList
          documents={sortedDocuments}
          onDocumentPress={handleDocumentPress}
          onEditDocument={handleEditDocument}
          onDeleteDocument={handleDeleteDocument}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowUploadModal(true)}
        disabled={uploading}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Tài Liệu</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowUploadModal(false);
                dispatch(resetUploadProgress());
              }}
            >
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <DocumentForm
            onSubmit={handleUploadDocument}
            loading={uploading}
            uploadProgress={uploadProgress}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF99CC",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  closeButton: {
    padding: 8,
  },
});
