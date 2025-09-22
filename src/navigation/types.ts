export type BottomTabParamList = {
  Dashboard: undefined;
  Products: undefined;
  Inventory: undefined;
  Orders: undefined;
  Users: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  Main: undefined;
  AddProductScreen: undefined;
  EditProductScreen: { productId: string };
  ProductDetailScreen: { productId: string };
  AddInventory: undefined;
  EditInventory: { id: string };
  Categories: undefined;
  AddCategory: undefined;
  EditCategory: { category: any };
  Brands: undefined;
  AddBrand: undefined;
  EditBrand: { brand: any };
};
