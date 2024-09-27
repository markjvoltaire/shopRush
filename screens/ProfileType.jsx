import React from "react";
import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";

export default function ProfileType({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, top: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#333",
            alignSelf: "center",
            bottom: 30,
          }}
        >
          Are you a shopper, driver, or store owner?
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        {/* Shopper Section */}
        <Pressable
          style={styles.card}
          onPress={() => navigation.navigate("EnterName")}
        >
          <Text style={styles.largeText}>Shopper 🛒</Text>
          <Text style={styles.mediumText}>
            Shop from local stores and have your items delivered in minutes
          </Text>
        </Pressable>

        {/* Driver Section */}
        <Pressable
          style={styles.card}
          onPress={() =>
            navigation.navigate("Name", {
              role: "driver",
            })
          }
        >
          <Text style={styles.largeText}>Driver 🚘</Text>
          <Text style={styles.mediumText}>
            Earn money by delivering Shop Rush orders
          </Text>
        </Pressable>

        {/* Store Section */}
        <Pressable
          style={styles.card}
          onPress={() =>
            navigation.navigate("Name", {
              role: "store",
            })
          }
        >
          <Text style={styles.largeText}>Store Owner 🏬</Text>
          <Text style={styles.mediumText}>
            Sell your store items and have them delivered sameday
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  largeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mediumText: {
    fontSize: 16,
    color: "#888",
    marginVertical: 5,
  },
});
