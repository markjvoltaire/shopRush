import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function HomeCard({ formattedAddress }) {
  const slideUpAnim = useRef(new Animated.Value(height)).current;
  const keyboardOffsetAnim = useRef(new Animated.Value(0)).current; // New animated value for keyboard offset
  const [keyBoardActive, setKeyBoardActive] = useState(false);
  const [address, setAddress] = useState(formattedAddress);

  useEffect(() => {
    // Animate the initial slide up of the card
    Animated.timing(slideUpAnim, {
      toValue: height * 0.65,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [slideUpAnim]);

  useEffect(() => {
    // Animate the keyboard offset when keyboard becomes active or inactive
    Animated.timing(keyboardOffsetAnim, {
      toValue: keyBoardActive ? -220 : 0, // Adjust the value to animate the view up or down
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [keyBoardActive]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateY: slideUpAnim },
              { translateY: keyboardOffsetAnim }, // Apply keyboard offset animation
            ],
          },
        ]}
      >
        <Text style={styles.title}>Confirm delivery location</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            autoCapitalize="none"
            value={address}
            onChangeText={setAddress}
            onFocus={() => setKeyBoardActive(true)}
            onBlur={() => setKeyBoardActive(false)}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          accessibilityLabel="Confirm location"
          accessibilityHint="Confirm delivery location"
        >
          <Text style={styles.buttonText}>Confirm location</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "white",
    width: width,
    height: height * 0.57,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 9.84,
  },
  title: {
    fontWeight: "700",
    fontSize: 20,
    color: "#333",
    marginBottom: 10,
    left: width * 0.07,
    top: 15,
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#544AF4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginVertical: 10,
    width: width * 0.8,
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
});
