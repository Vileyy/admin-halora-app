import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Document } from "../../types/document";
import { DocumentCard } from "./DocumentCard";

interface DocumentListProps {
  documents: Document[];
  onDocumentPress?: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
  onDeleteDocument?: (document: Document) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDocumentPress,
  onEditDocument,
  onDeleteDocument,
  loading = false,
  refreshing = false,
  onRefresh,
  onLoadMore,
  hasMore = false,
}) => {
  const renderDocument = ({ item }: { item: Document }) => (
    <DocumentCard
      document={item}
      onPress={onDocumentPress}
      onEdit={onEditDocument}
      onDelete={onDeleteDocument}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Chưa có tài liệu nào</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || !hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#FF99CC" />
      </View>
    );
  };

  if (loading && documents.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF99CC" />
        <Text style={styles.loadingText}>Đang tải tài liệu...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={documents}
      renderItem={renderDocument}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF99CC"]}
            tintColor="#FF99CC"
          />
        ) : undefined
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
