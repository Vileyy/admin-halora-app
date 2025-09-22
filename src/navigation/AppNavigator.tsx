import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from "./BottomTabs";
import LoginScreen from "../screens/auth/LoginScreen";
import { RootStackParamList } from "./types";
import AddProductScreen from "../screens/products/AddProductScreen";
import EditProductScreen from "../screens/products/EditProductScreen";
import ProductDetailScreen from "../screens/products/ProductDetailScreen";
import AddInventoryScreen from "../screens/inventory/AddInventoryScreen";
import EditInventoryScreen from "../screens/inventory/EditInventoryScreen";
import CategoriesScreen from "../screens/categories/CategoriesScreen";
import AddCategoryScreen from "../screens/categories/AddCategoryScreen";
import EditCategoryScreen from "../screens/categories/EditCategoryScreen";
import BrandsScreen from "../screens/brands/BrandsScreen";
import AddBrandScreen from "../screens/brands/AddBrandScreen";
import EditBrandScreen from "../screens/brands/EditBrandScreen";
import BannersScreen from "../screens/banners/BannersScreen";
import AddBannerScreen from "../screens/banners/AddBannerScreen";
import EditBannerScreen from "../screens/banners/EditBannerScreen";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
        <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
        <Stack.Screen
          name="ProductDetailScreen"
          component={ProductDetailScreen}
        />
        <Stack.Screen name="AddInventory" component={AddInventoryScreen} />
        <Stack.Screen name="EditInventory" component={EditInventoryScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
        <Stack.Screen name="EditCategory" component={EditCategoryScreen} />
        <Stack.Screen name="Brands" component={BrandsScreen} />
        <Stack.Screen name="AddBrand" component={AddBrandScreen} />
        <Stack.Screen name="EditBrand" component={EditBrandScreen} />
        <Stack.Screen name="Banners" component={BannersScreen} />
        <Stack.Screen name="AddBanner" component={AddBannerScreen} />
        <Stack.Screen name="EditBanner" component={EditBannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
