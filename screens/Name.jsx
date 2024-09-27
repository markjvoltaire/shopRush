import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Name({ route, navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const type = route.params.role;

  console.log("type", type);

  return (
    <>
      <SafeAreaView
        style={{ backgroundColor: "#f8f9fa", padding: 15, height: 10 }}
      ></SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.header}>Let's Get to Know You</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Your First Name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Your Last Name"
          value={lastName}
          onChangeText={setLastName}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddAddress", {
                firstName,
                lastName,
                type,
              });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#544AF4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
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
  cityList: {
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
    width: "100%",
    overflow: "hidden",
  },
  cityItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
