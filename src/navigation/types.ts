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
  Banners: undefined;
  AddBanner: undefined;
  EditBanner: { banner: any };
  Notifications: undefined;
  AddNotification: undefined;
  EditNotification: { notification: any };
  Reviews: undefined;
  Revenue: undefined;
  Vouchers: undefined;
  AddVoucher: { type?: "shipping" | "product" };
};
