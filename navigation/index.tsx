import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Colors from "../constants/Colors";
import Cart from "../screens/Shop/Cart/Cart.screen";
import ProductDetail from "../screens/Shop/ProductDetail/ProductDetail.screen";
import ProductsOverview from "../screens/Shop/ProductsOverview/ProductsOverview.screen";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  RootStackParamList,
  OrderStackParamList,
  OrderDrawerParamList,
  UserStackParamList,
  AuthStackParamList,
} from "../types";
import Orders from "../screens/Shop/Orders/Orders.screen";
import { Ionicons } from "@expo/vector-icons";
import UserProducts from "../screens/User/UserProducts/UserProducts.screen";
import EditProduct from "../screens/User/EditProduct/EditProduct.screen";
import AuthScreen from "../screens/AuthScreen/AuthScreen.component";
import { useTypedSelector } from "../hooks/redux-hooks/useTypedSelector";
import StartupScreen from "../screens/StartupScreen/StartupScreen.screen";
import { Button } from "react-native";
import { useActions } from "../hooks/redux-hooks/useActions";

export default function Navigation() {
  const auth = useTypedSelector((state) => state.auth);
  return (
    <NavigationContainer>
      {auth?.token && auth?.userId ? <DrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
const Stack = createNativeStackNavigator<RootStackParamList>();
const OrderStack = createNativeStackNavigator<OrderStackParamList>();
const UserStack = createNativeStackNavigator<UserStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const defaultScreenOptions: any = {
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerStyle: {
    backgroundColor: Colors.tint,
  },
  headerTintColor: Colors.secondary,
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTitleAlign: "center",
};

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="Products" component={ProductsOverview} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  );
}

function OrdersNavigator() {
  return (
    <OrderStack.Navigator screenOptions={defaultScreenOptions}>
      <OrderStack.Screen name="Orders" component={Orders} />
    </OrderStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="StartupScreen"
      screenOptions={defaultScreenOptions}
    >
      <AuthStack.Screen name="StartupScreen" component={StartupScreen} />
      <AuthStack.Screen name="AuthScreen" component={AuthScreen} />
    </AuthStack.Navigator>
  );
}

function UserNavigator() {
  return (
    <UserStack.Navigator screenOptions={defaultScreenOptions}>
      <UserStack.Screen name="UserProducts" component={UserProducts} />
      <UserStack.Screen name="EditProduct" component={EditProduct} />
    </UserStack.Navigator>
  );
}

function CustomDrawerContent(props: any) {
  const { unauthenticateUser } = useActions();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Button
        title="Log out"
        color={Colors.tint}
        onPress={unauthenticateUser}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator<OrderDrawerParamList>();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="ProductsMain"
        options={{
          drawerLabel: "Products",
          headerTitle: "Products",
          drawerIcon: ({ color }) => (
            <Ionicons name="ios-cart" size={23} color={color} />
          ),
        }}
        component={RootNavigator}
      />
      <Drawer.Screen
        name="OrdersMain"
        options={{
          drawerLabel: "Orders",
          headerTitle: "Orders",
          drawerIcon: ({ color }) => (
            <Ionicons name="ios-list" size={23} color={color} />
          ),
        }}
        component={OrdersNavigator}
      />
      <Drawer.Screen
        name="UserMain"
        options={{
          drawerLabel: "User",
          headerTitle: "User Products",
          drawerIcon: ({ color }) => (
            <Ionicons name="ios-create" size={23} color={color} />
          ),
        }}
        component={UserNavigator}
      />
    </Drawer.Navigator>
  );
}
