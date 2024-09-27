import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "../useContext/userContext";
import { supabase } from "../services/supabase";

export default function ManageOrder({ route, navigation }) {
  const order = route.params.order;
  const createdAt = new Date(order.created_at);
  const [status, setStatus] = useState(order.status);

  const { user } = useUser();

  // Function to calculate how long ago the date was
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000); // Years
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000); // Months
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400); // Days
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600); // Hours
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60); // Minutes
    if (interval > 1) return `${interval} minutes ago`;
    return `${seconds} seconds ago`;
  };

  async function getDrivers() {
    const { data, error } = await supabase
      .from("driver_location")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }

    return data;
  }

  const orderPrepared = async () => {
    // Ensure order and user are defined
    if (!order || !user) {
      Alert.alert("Order and user information are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/awaitingDriver", {
        method: "POST",
        body: JSON.stringify({ order, user }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      // Check if response is OK
      if (!response.ok) {
        console.error("Error response data:", data); // Log error data for debugging
        Alert.alert(data.message || "An error occurred. Please try again."); // Use default message if none is provided
        return;
      }
    } catch (err) {
      console.error("Fetch error:", err); // More specific error logging
      Alert.alert("Something went wrong, try again later!");
    }
  };

  const sendNotification = async () => {
    try {
      // Notification message
      const message = {
        to: order.expo_push_token,
        sound: "default",
        title: "Your Order is Ready for Pickup!",
        body: "Great news! Your order has been prepared, and a driver will be picking it up shortly.",
      };

      // Send the notification
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
        body: JSON.stringify(message),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      await response.json();
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.largeText}>Order Details</Text>
        <Text style={styles.mediumText}>
          Customer: {order.customerFirstName}
        </Text>
        <Text style={styles.mediumText}>Order ID: {order.orderId}</Text>
        <Text style={styles.mediumText}>Status: {order.status}</Text>

        <Text style={styles.mediumText}>
          Order Placed: {timeAgo(createdAt)}
        </Text>

        {order.productImage && (
          <Image
            source={{ uri: order.productImage }}
            style={styles.productImage}
            resizeMode="contain"
          />
        )}
      </View>

      <Pressable
        onPress={() =>
          status === "Awaiting Driver" ? orderPrepared() : orderPrepared()
        }
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {status === "Awaiting Driver"
            ? "Track Delivery"
            : "Ready For Pick Up"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => alert("HELLO")}
        style={{
          backgroundColor: "black",
          paddingVertical: 15,
          borderRadius: 10,
          alignItems: "center",
          marginHorizontal: 20,
          marginBottom: 25,
        }}
      >
        <Text style={styles.buttonText}>Cancel Order</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#544AF4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  largeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mediumText: {
    fontSize: 16,
    color: "#888",
    marginVertical: 5,
  },
  productImage: {
    width: "100%",
    height: 200, // Adjust height as needed
    marginVertical: 10,
  },
});
