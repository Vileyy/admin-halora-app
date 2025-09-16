import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";

// Screens
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ProductsScreen from "../screens/products/ProductsScreen";
import OrdersScreen from "../screens/orders/OrdersScreen";
import UsersScreen from "../screens/users/UsersScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF99CC",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff" },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
