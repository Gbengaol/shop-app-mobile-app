import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FC, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Button,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useTypedSelector } from "../../../hooks/redux-hooks/useTypedSelector";
import { OrderStackParamList } from "../../../types";
import CustomHeaderButton from "../../../components/HeaderButton/HeaderButton.component";
import OrderItem from "../../../components/OrderItem/OrderItem.component";
import useOrders from "../../../hooks/http-hooks/useOrders";
import Colors from "../../../constants/Colors";
import { errorHandler } from "../../../helpers/errorHandler";

interface Orders {}

type OrderNavigatorProps = NativeStackNavigationProp<
  OrderStackParamList,
  "Orders"
>;

const Orders: FC<Orders> = ({}) => {
  const userId = useTypedSelector((state) => state.auth?.userId);
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useOrders({
    userId,
  });
  const navigation: any = useNavigation<OrderNavigatorProps>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Your Orders",
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Menu"
            iconName="ios-menu"
            onPress={() => navigation.toggleDrawer()}
          />
        </HeaderButtons>
      ),
    });
  }, []);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{errorHandler(error)}</Text>
        <Button
          title="Try Again"
          onPress={() => refetch()}
          color={Colors.tint}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.tint} size="large" />
        </View>
      ) : !orders?.length ? (
        <View style={styles.centered}>
          <Text>No orders found. Start adding orders</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <OrderItem orderItem={item} date={item.date} />
            </View>
          )}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Orders;
