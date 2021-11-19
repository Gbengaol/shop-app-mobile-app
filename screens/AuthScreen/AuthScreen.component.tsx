import React, { FC, useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CustomTextInput from "../../components/TextInput/TextInput.component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { yupValidators } from "../../helpers/yupValidators";
import Card from "../../components/Card/Card.component";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { LinearGradient } from "expo-linear-gradient";
import { apiEndpoints } from "../../apis/apiEndpoints";
import { postAuthData } from "../../apis/apiMethods";
import { errorHandler } from "../../helpers/errorHandler";
import { useActions } from "../../hooks/redux-hooks/useActions";
import * as SecureStore from "expo-secure-store";
import { add } from "date-fns";

interface AuthScreenProps {}

const schema = yup.object().shape({
  email: yupValidators.genericRequired({
    message: "Enter a valid email address",
    min: 2,
    max: 64,
  }),
  password: yupValidators.genericRequired({
    message: "Enter your password",
    min: 5,
    max: 64,
  }),
});

type FormData = {
  email: string;
  password: string;
};

type AuthNavigatorProps = NativeStackNavigationProp<
  AuthStackParamList,
  "AuthScreen"
>;

const AuthScreen: FC<AuthScreenProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupMode, setSignupMode] = useState(false);
  const navigation = useNavigation<AuthNavigatorProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { authenticateUser, autoLogoutUser } = useActions();

  const authHandler = async ({ email, password }: FormData) => {
    setError("");
    setLoading(true);

    const url = signupMode
      ? `${apiEndpoints.SIGN_UP}?key=AIzaSyDqDLllDAg5WAj6A4IgrLODGAp6Ed90tSM`
      : `${apiEndpoints.LOGIN}?key=AIzaSyDqDLllDAg5WAj6A4IgrLODGAp6Ed90tSM`;
    try {
      const { localId, idToken, expiresIn } = await postAuthData(url, {
        email,
        password,
        returnSecureToken: true,
      });

      setLoading(false);
      const expirationDate = add(new Date(), {
        seconds: Number(expiresIn),
      });

      await SecureStore.setItemAsync(
        "userData",
        JSON.stringify({
          userId: localId,
          token: idToken,
          expiryDate: expirationDate,
        })
      );
      authenticateUser({
        userId: localId,
        token: idToken,
      });
      autoLogoutUser(Number(expiresIn) * 1000);
    } catch (error) {
      setError(errorHandler(error));
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: signupMode ? "Sign Up" : "Log In" });
  }, [signupMode]);

  useEffect(() => {
    if (error)
      Alert.alert("An error occured", error, [
        {
          text: "Close",
        },
      ]);
  }, [error]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={100}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.background}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <CustomTextInput
              label="Email"
              name="email"
              autoCapitalize="none"
              returnKeyType="next"
              control={control}
              error={errors.email}
              keyboardType="email-address"
            />
            <CustomTextInput
              label="Password"
              name="password"
              returnKeyType="next"
              control={control}
              error={errors.password}
              keyboardType="default"
              secureTextEntry={true}
            />

            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={signupMode ? "Sign Up" : "Login"}
                  color={Colors.primary}
                  onPress={handleSubmit(authHandler)}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${signupMode ? "Login" : "Sign Up"}`}
                color={Colors.tint}
                onPress={() => setSignupMode((prevState) => !prevState)}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1 },
  authContainer: { width: "80%", maxWidth: 400, maxHeight: 400, padding: 20 },
  buttonContainer: { marginTop: 10 },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default AuthScreen;
