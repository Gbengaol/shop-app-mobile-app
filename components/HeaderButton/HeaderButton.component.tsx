import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderButton } from "react-navigation-header-buttons";
import Colors from "../../constants/Colors";

interface HeaderButtonProps {
  title: string;
}

const CustomHeaderButton: FC<HeaderButtonProps> = (props) => {
  return (
    <HeaderButton
      IconComponent={Ionicons}
      iconSize={23}
      {...props}
      title={props.title}
      color={Colors.secondary}
    />
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1 },
});
export default CustomHeaderButton;
