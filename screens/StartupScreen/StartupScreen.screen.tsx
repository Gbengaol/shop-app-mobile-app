import React, { FC, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { useActions } from "../../hooks/redux-hooks/useActions";
import { differenceInSeconds, parseISO } from "date-fns";

interface StartupScreenProps {}

type AuthNavigatorProps = NativeStackNavigationProp<
  AuthStackParamList,
  "AuthScreen"
>;

const StartupScreen: FC<StartupScreenProps> = ({}) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const { authenticateUser, autoLogoutUser } = useActions();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await SecureStore.getItemAsync("userData");
      if (!userData) {
        navigation.replace("AuthScreen");
        return;
      }

      const { userId, token, expiryDate } = JSON.parse(userData);

      const expiryTime = differenceInSeconds(parseISO(expiryDate), new Date());
      // Log user out if expiry time is less than 10 minutes
      if (expiryTime < 600 || !token || !userId) {
        navigation.replace("AuthScreen");
        return;
      }
      authenticateUser({
        userId,
        token,
      });
      autoLogoutUser(Number(expiryTime) * 1000);
    };
    tryLogin();
  }, []);
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.tint} />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
});
export default StartupScreen;
