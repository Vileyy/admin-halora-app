import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { User, UserFilters } from "../../types/user";
import UserCard from "./UserCard";
import { Ionicons } from "@expo/vector-icons";

interface UserListProps {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
  onUserPress: (user: User) => void;
  onStatusChange: (
    user: User,
    newStatus: "active" | "inactive" | "banned"
  ) => void;
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  onRefresh,
  onUserPress,
  onStatusChange,
  filters,
  onFiltersChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    onFiltersChange({ ...filters, searchTerm: text });
  };

  const handleStatusFilter = (
    status: "active" | "inactive" | "banned" | "all"
  ) => {
    const newFilters = { ...filters };
    if (status === "all") {
      delete newFilters.status;
    } else {
      newFilters.status = status;
    }
    onFiltersChange(newFilters);
  };

  const handleRoleFilter = (role: "admin" | "user" | "all") => {
    const newFilters = { ...filters };
    if (role === "all") {
      delete newFilters.role;
    } else {
      newFilters.role = role;
    }
    onFiltersChange(newFilters);
  };

  const handleSort = (sortBy: "createdAt" | "displayName" | "totalOrders") => {
    const newFilters = { ...filters };
    if (newFilters.sortBy === sortBy) {
      newFilters.sortOrder = newFilters.sortOrder === "asc" ? "desc" : "asc";
    } else {
      newFilters.sortBy = sortBy;
      newFilters.sortOrder = "desc";
    }
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    onFiltersChange({
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const getSortIcon = (field: string) => {
    if (filters.sortBy !== field) return "swap-vertical";
    return filters.sortOrder === "asc" ? "arrow-up" : "arrow-down";
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Bộ lọc</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Trạng thái</Text>
          <View style={styles.filterOptions}>
            {[
              { key: "all", label: "Tất cả" },
              { key: "active", label: "Hoạt động" },
              { key: "inactive", label: "Không hoạt động" },
              { key: "banned", label: "Bị cấm" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  (!filters.status && option.key === "all") ||
                  filters.status === option.key
                    ? styles.filterOptionActive
                    : null,
                ]}
                onPress={() => handleStatusFilter(option.key as any)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    (!filters.status && option.key === "all") ||
                    filters.status === option.key
                      ? styles.filterOptionTextActive
                      : null,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Vai trò</Text>
          <View style={styles.filterOptions}>
            {[
              { key: "all", label: "Tất cả" },
              { key: "user", label: "Người dùng" },
              { key: "admin", label: "Quản trị viên" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  (!filters.role && option.key === "all") ||
                  filters.role === option.key
                    ? styles.filterOptionActive
                    : null,
                ]}
                onPress={() => handleRoleFilter(option.key as any)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    (!filters.role && option.key === "all") ||
                    filters.role === option.key
                      ? styles.filterOptionTextActive
                      : null,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderUser = ({ item }: { item: User }) => (
    <UserCard
      user={item}
      onPress={onUserPress}
      onStatusChange={onStatusChange}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>Không có người dùng</Text>
      <Text style={styles.emptySubtitle}>
        {filters.searchTerm || filters.status || filters.role
          ? "Không tìm thấy người dùng phù hợp với bộ lọc"
          : "Chưa có người dùng nào trong hệ thống"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => handleSort("createdAt")}
        >
          <Text style={styles.sortButtonText}>Ngày tạo</Text>
          <Ionicons name={getSortIcon("createdAt")} size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => handleSort("displayName")}
        >
          <Text style={styles.sortButtonText}>Tên</Text>
          <Ionicons name={getSortIcon("displayName")} size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => handleSort("totalOrders")}
        >
          <Text style={styles.sortButtonText}>Đơn hàng</Text>
          <Ionicons name={getSortIcon("totalOrders")} size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* User List */}
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.uid}
        refreshing={loading}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1A1A1A",
  },
  filterButton: {
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  sortContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    gap: 16,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  filterOptionActive: {
    backgroundColor: "#FF99CC",
    borderColor: "#FF99CC",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterOptionTextActive: {
    color: "#FFFFFF",
  },
  modalActions: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    marginTop: "auto",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#FF99CC",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default UserList;
