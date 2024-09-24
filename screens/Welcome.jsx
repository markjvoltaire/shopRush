import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Modal,
  View,
  TouchableOpacity,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function Welcome({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a timer to change loading state after 1 second
    const timer = setTimeout(() => setLoading(false), 1000);

    // Cleanup the timer if the component is unmounted before the timer completes
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = useCallback(() => {
    navigation.navigate("EnterName");
  }, [navigation]);

  const handleLogin = useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal animationType="fade" visible={loading} transparent={true}>
        <View style={styles.modalContainer}>
          <Image
            style={styles.modalImage}
            source={require("../assets/linkSplash.png")}
          />
        </View>
      </Modal>

      {!loading && (
        <View style={styles.contentContainer}>
          <Image
            style={styles.image}
            source={require("../assets/linkSpaceTransparent.png")}
          />
          <Text style={styles.text}>Shop Rush</Text>
          <Text
            style={{
              position: "absolute",
              color: "white",
              fontWeight: "700",
              marginBottom: 120,
              fontSize: 16,
            }}
          >
            Where Style Meets Speed
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#4617A7",
              paddingVertical: 15,
              paddingHorizontal: 40,
              borderRadius: 15,
              marginVertical: 10, // Space between buttons
              width: width * 0.8, // Set fixed width for consistency
              alignItems: "center",
              top: 150,
            }}
            onPress={handleGetStarted}
            accessibilityLabel="Create an account"
            accessibilityHint="Navigate to account creation screen"
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
                textAlign: "center",
                fontFamily: "Poppins-Bold",
              }}
            >
              Create an account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            accessibilityLabel="Create an account"
            accessibilityHint="Navigate to account creation screen"
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#544AF4",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: darken background
  },
  modalImage: {
    height,
    width,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    height: 70,
    width: 70,
    resizeMode: "contain",
  },
  text: {
    fontSize: 55,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    marginBottom: 70,
  },
  button: {
    backgroundColor: "#EAE4FD",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginVertical: 10, // Space between buttons
    width: width * 0.8, // Set fixed width for consistency
    alignItems: "center",
    top: 150,
  },
  buttonText: {
    fontSize: 16,
    color: "#544AF4",
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
});
