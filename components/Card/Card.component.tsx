import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

interface CardProps {
  style?: any;
}

const Card: FC<CardProps> = ({ children, style }) => {
  return <View style={{ ...styles.screen, ...style }}>{children}</View>;
};
const styles = StyleSheet.create({
  screen: {
    shadowColor: "#000",
    shadowOpacity: 0.26,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
});
export default Card;
