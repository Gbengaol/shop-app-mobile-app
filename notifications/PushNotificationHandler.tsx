import Constants from "expo-constants";
import { Subscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import axios from "axios";
import { errorHandler } from "../helpers/errorHandler";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function usePushNotificationHandler() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("notification", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        ({ notification }) => {
          console.log("response", notification);
        }
      );

    return () => {
      Notifications.removeNotificationSubscription(
        // @ts-ignore
        notificationListener.current
      );
      // @ts-ignore
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { expoPushToken };
}

export async function schedulePushNotification({
  title,
  body,
  data,
  trigger,
}: {
  title: string;
  body: string;
  data: {};
  trigger: number;
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { data },
    },
    trigger: { seconds: trigger },
  });
}

export async function registerForPushNotificationsAsync() {
  let token: string = "";
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function sendPushNotification({
  to,
  title,
  body,
  data,
}: {
  to: Array<string> | string;
  title: string;
  body: string;
  data?: {};
}) {
  const reqBody = {
    to,
    title,
    body,
    data,
  };
  try {
    await axios("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "accept-encoding": "gzip, deflate",
        host: "exp.host",
      },
      data: reqBody,
    });
  } catch (error) {
    console.log(errorHandler(error));
  }
}
