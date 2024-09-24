import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../services/supabase";

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const next = async () => {
    navigation.navigate("SignUp", { firstName, lastName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ top: 50 }}>
        <View style={styles.header}>
          <Text style={styles.title}>What's your name? 👋</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={(e) => setFirstName(e)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={(e) => setLastName(e)}
          />
        </View>
        <Pressable
          onPress={next}
          style={{
            backgroundColor: "#544AF4",
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#f8f9fa",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
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
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SignUp;
