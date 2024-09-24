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
  Dimensions,
} from "react-native";
import { supabase } from "../services/supabase";

const SignUp = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const [error, setError] = useState(""); // New state for error messages
  const { height, width } = Dimensions.get("window");
  const { firstName, lastName } = route.params;

  const signUpWithEmail = async () => {
    setLoading(true); // Start loading

    // Input validation
    if (password.length < 8) {
      Alert.alert("Password should be 8 or more characters");
      setLoading(false);
      return;
    }

    if (!email) {
      Alert.alert("Please fill in all field inputs");
      setLoading(false);
      return;
    }

    try {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setLoading(false);
        Alert.alert(error.message);
        return;
      }

      if (user) {
        const userId = user.id; // Get user ID from the sign-up response
        const resp = await supabase.from("profiles").insert([
          {
            firstName: firstName,
            lastName: lastName,
            userId: userId,
            email: email,
          },
        ]);

        if (resp.error) {
          setLoading(false);
          Alert.alert(resp.error.message);
        } else {
          // Optionally navigate to another screen or show a success message
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred during sign-up:", error);
      Alert.alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Ensure loading is set to false at the end
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ top: 50 }}>
        <View
          style={{
            marginBottom: 40,
            alignItems: "center",
            width: width * 0.9,
            alignSelf: "center",
          }}
        >
          <Text style={styles.title}>
            enter an email and password to sign up.
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>
        <Pressable
          onPress={signUpWithEmail}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
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
    marginBottom: 40,
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
