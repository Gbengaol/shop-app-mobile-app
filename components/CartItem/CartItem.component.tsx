import React, { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ICart } from "../../interfaces/cart";
import TouchableComponent from "../TouchableComponent/TouchableComponent.component";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useActions } from "../../hooks/redux-hooks/useActions";

interface CartItemProps {
  item: ICart;
  hideDelete?: boolean;
}

const CartItem: FC<CartItemProps> = ({ item, hideDelete }) => {
  const { removeFromCart } = useActions();
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}> {item?.quantity} </Text>
        <Text style={styles.mainText}>{item?.productTitle}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>{item?.productPrice.toFixed(2)}</Text>
        {hideDelete ? null : (
          <View style={styles.deleteButton}>
            <TouchableComponent onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash" size={23} color="red" />
            </TouchableComponent>
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "open-sans",
    color: "#333",
    fontSize: 16,
  },
  mainText: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 20,
  },
});
export default CartItem;
