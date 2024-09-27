import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import Categories from "../components/Categories";
import NewStores from "../components/NewStores";
import LocalFavorites from "../components/LocalFavorites";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { supabase } from "../services/supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Home({ navigation }) {
  const { height, width } = Dimensions.get("window");
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error("Project ID not found");
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log("token", token);

        await updateExpoToken(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const updateExpoToken = async (token) => {
    console.log("token", token);

    const userId = supabase.auth.currentUser.id;

    const res = await supabase
      .from("profiles")
      .update({ expo_push_token: token })
      .eq("userId", userId);

    if (res.error) {
      console.log("ERROR", res.error);
      Alert.alert("Something Went Wrong");
    }

    return res;
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <AppHeader />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Stores and Products"
        />
      </SafeAreaView>
      <ScrollView style={{ backgroundColor: "white", flex: 1, padding: 10 }}>
        <LocalFavorites navigation={navigation} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  categoryText: {
    marginBottom: 20,
    fontWeight: "700",
    color: "#333",
    fontSize: 17,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    padding: 15,
    width: "95%",
    alignSelf: "center", // Aligns the input to the start
    fontSize: 16,
    backgroundColor: "#fff",
    top: 20,
  },
});
