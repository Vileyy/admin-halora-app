import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

// Screens
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ProductsScreen from "../screens/products/ProductsScreen";
import InventoryScreen from "../screens/inventory/InventoryScreen";
import OrdersScreen from "../screens/orders/OrdersScreen";
import UsersScreen from "../screens/users/UsersScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

// Icons
import {
  ChartIcon,
  BoxIcon,
  DatabaseIcon,
  ShoppingCartIcon,
  UsersIcon,
  SettingsIcon,
} from "../components/common/icons";

// Types
import { BottomTabParamList } from "./types";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = size || 24;
          const iconColor = color || "#666";

          switch (route.name) {
            case "Dashboard":
              return <ChartIcon size={iconSize} color={iconColor} />;
            case "Products":
              return <BoxIcon size={iconSize} color={iconColor} />;
            case "Inventory":
              return <DatabaseIcon size={iconSize} color={iconColor} />;
            case "Orders":
              return <ShoppingCartIcon size={iconSize} color={iconColor} />;
            case "Users":
              return <UsersIcon size={iconSize} color={iconColor} />;
            case "Settings":
              return <SettingsIcon size={iconSize} color={iconColor} />;
            default:
              return <ChartIcon size={iconSize} color={iconColor} />;
          }
        },
        tabBarActiveTintColor: "#FF99CC",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          paddingBottom: Platform.OS === "ios" ? 20 : 5,
          paddingTop: 5,
          height: Platform.OS === "ios" ? 85 : 65,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Tổng quan",
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: "Sản phẩm",
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarLabel: "Kho hàng",
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: "Đơn hàng",
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          tabBarLabel: "Người dùng",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Cài đặt",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
