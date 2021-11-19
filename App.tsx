import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import Navigation from "./navigation/index";
import { store } from "./store/store";
import useCachedResources from "./hooks/useCachedResources";
import { QueryClientProvider, QueryClient } from "react-query";
import usePushNotificationHandler from "./notifications/PushNotificationHandler";

const queryClient = new QueryClient();

export default function App() {
  const isLoadingComplete = useCachedResources();
  usePushNotificationHandler();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <View style={styles.container}>
            <Navigation />
          </View>
        </QueryClientProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
