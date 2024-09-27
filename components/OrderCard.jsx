import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";

export default function OrderCard({ order, navigation }) {
  const createdAt = new Date(order.created_at);

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

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() =>
          navigation.navigate("ManageOrder", {
            order: order,
          })
        }
      >
        <View style={styles.card}>
          <Text style={styles.largeText}>Order Details</Text>
          <Text style={styles.mediumText}>
            Customer: {order.customerFirstName}
          </Text>
          <Text style={styles.mediumText}>Order ID: {order.orderId}</Text>
          <Text style={styles.mediumText}>Status: {order.status}</Text>

          {order.productImage && (
            <Image
              source={{ uri: order.productImage }}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}

          <Text style={styles.mediumText}>
            Order Placed: {timeAgo(createdAt)}
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
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
