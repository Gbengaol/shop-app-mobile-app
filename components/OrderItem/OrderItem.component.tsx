import React, { FC, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import CartItem from "../CartItem/CartItem.component";
import { IOrder } from "../../interfaces/order";
import Colors from "../../constants/Colors";
import { format } from "date-fns";
import Card from "../Card/Card.component";

interface OrderItemProps {
  orderItem: IOrder;
  date: Date;
}

const OrderItem: FC<OrderItemProps> = ({
  orderItem: { items, totalAmount },
  date,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        <Text style={styles.date}>
          {format(new Date(date), "MMM-dd-yyyy HH:mm")}
        </Text>
      </View>
      <Button
        title={showDetails ? "Hide Details" : "Show Details"}
        color={Colors.primary}
        onPress={() => setShowDetails((prevState) => !prevState)}
      />
      {showDetails && (
        <View style={styles.details}>
          {items?.map((item) => (
            <CartItem item={item} key={item.id} hideDelete={true}></CartItem>
          ))}
        </View>
      )}
    </Card>
  );
};
const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888",
  },
  details: {
    width: "100%",
  },
});
export default OrderItem;
