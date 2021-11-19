export type RootStackParamList = {
  Products: undefined;
  ProductDetail: {
    productId: string;
  };
  Cart: undefined;
};
export type OrderStackParamList = {
  Orders: undefined;
};
export type UserStackParamList = {
  UserProducts: undefined;
  EditProduct: {
    productId?: string;
  };
};
export type AuthStackParamList = {
  StartupScreen: undefined;
  AuthScreen: undefined;
};
export type OrderDrawerParamList = {
  ProductsMain: undefined;
  OrdersMain: undefined;
  UserMain: undefined;
};
