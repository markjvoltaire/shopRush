import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { supabase } from "../services/supabase";
import OrderCard from "../components/OrderCard";
import { useUser } from "../useContext/userContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function StoreHome({ navigation }) {
  const { height, width } = Dimensions.get("window");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [orders, setOrders] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const registerForPushNotifications = async () => {
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
          token = (await Notifications.getExpoPushTokenAsync({ projectId }))
            .data;
          console.log("token", token);

          await updateExpoToken(token);
        } catch (e) {
          token = `${e}`;
        }
      } else {
        alert("Must use physical device for Push Notifications");
      }

      return token;
    };

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("storeId", user.userId)
        .order("id", { ascending: false }); // Order by id in ascending order

      if (error) console.error("Error fetching orders:", error);
      else setOrders(data);
    };

    const subscription = supabase
      .from("orders")
      .on("*", (payload) => {
        fetchOrders(); // Re-fetch data or update state accordingly
      })
      .subscribe();

    registerForPushNotifications().then(
      (token) => token && setExpoPushToken(token)
    );
    fetchOrders();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const updateExpoToken = async (token) => {
    console.log("token", token);

    const userId = supabase.auth.currentUser?.id;
    if (!userId) {
      Alert.alert("Error", "User is not logged in");
      return; // Exit if no user is authenticated
    }

    const res = await supabase
      .from("profiles")
      .update({ expo_push_token: token })
      .eq("userId", userId);

    if (res.error) {
      console.log("ERROR", res.error);
      Alert.alert("Error", res.error.message || "Something Went Wrong");
    }

    return res;
  };

  // Render each order item using OrderCard
  const renderOrderItem = ({ item }) => (
    <View style={{ marginBottom: 10, padding: 10 }}>
      <OrderCard navigation={navigation} order={item} />
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ padding: 10 }}>
        <AppHeader />
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          Pending Orders ({orders.length})
        </Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()} // Assuming id is unique
        contentContainerStyle={styles.container} // Use styles for the FlatList container
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
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
