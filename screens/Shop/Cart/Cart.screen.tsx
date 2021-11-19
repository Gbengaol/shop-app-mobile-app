import React, { FC, useMemo, useLayoutEffect, useState, Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CartItem from "../../../components/CartItem/CartItem.component";
import Colors from "../../../constants/Colors";
import { useTypedSelector } from "../../../hooks/redux-hooks/useTypedSelector";
import { ICart } from "../../../interfaces/cart";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Card from "../../../components/Card/Card.component";
import { postData } from "../../../apis/apiMethods";
import { apiEndpoints } from "../../../apis/apiEndpoints";
import { useQueryClient } from "react-query";
import { errorHandler } from "../../../helpers/errorHandler";
import { sendPushNotification } from "../../../notifications/PushNotificationHandler";
import { useActions } from "../../../hooks/redux-hooks/useActions";

interface CartProps {}

type CartNavigatorProps = NativeStackNavigationProp<RootStackParamList, "Cart">;

const Cart: FC<CartProps> = ({}) => {
  const cartItems = useTypedSelector((state) => state.cart?.items);
  const navigation = useNavigation<CartNavigatorProps>();

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const queryClient = useQueryClient();
  const auth = useTypedSelector((state) => state.auth);
  const { clearCart } = useActions();

  const addOrder = async () => {
    setIsError("");
    setLoading(true);

    try {
      const newOrder = {
        items: cartItems,
        totalAmount,
        date: new Date().toISOString(),
      };
      await postData(
        `${apiEndpoints.ORDERS}/${auth?.userId}.json?auth=${auth?.token}`,
        newOrder
      );

      cartItems?.map(async (cartItem) => {
        await sendPushNotification({
          to: cartItem.ownerPushToken,
          title: "You have a new order",
          body: `${cartItem.quantity} pieces of ${cartItem.productTitle} has been ordered for`,
          data: {},
        });
      });

      clearCart();
      queryClient.invalidateQueries(["getOrders"]);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setIsError(errorHandler(error));
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: "Your Cart" });
  }, []);

  const totalAmount = useMemo(
    () => cartItems?.reduce((acc, cartItem) => acc + cartItem.sum, 0),
    [cartItems]
  );

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>{errorHandler(isError)}</Text>
        <Button
          title="Try Again"
          onPress={() => addOrder()}
          color={Colors.tint}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.tint} size="large" />
        </View>
      ) : (
        <Fragment>
          <Card style={styles.summary}>
            <Text style={styles.summaryText}>
              Total:
              <Text style={styles.amount}>${totalAmount?.toFixed(2)}</Text>
            </Text>
            <Button
              title="Order Now"
              disabled={!cartItems?.length}
              color={Colors.tint}
              onPress={() => {
                if (cartItems && totalAmount) addOrder();
              }}
            />
          </Card>
          <FlatList
            data={cartItems}
            keyExtractor={(item: ICart) => item.id}
            renderItem={({ item }) => <CartItem item={item} />}
          />
        </Fragment>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, margin: 20 },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: Colors.secondary,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.tint,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Cart;
