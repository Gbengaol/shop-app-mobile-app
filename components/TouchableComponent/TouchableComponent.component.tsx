import React, { FC } from "react";
import {
  TouchableOpacity,
  View,
  Platform,
  TouchableNativeFeedback,
} from "react-native";

interface TouchableComponent {
  onPress?: () => void;
}

const TouchableComponent: FC<TouchableComponent> = ({ children, onPress }) => {
  let TouchableComponent: any = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }
  return (
    <TouchableComponent useForeground onPress={onPress}>
      {children}
    </TouchableComponent>
  );
};
export default TouchableComponent;
