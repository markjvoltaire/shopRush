import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { supabase } from "../services/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const loginWithEmail = async () => {
    try {
      setLoading(true); // Set loading state to true when starting login
      const { data: user, error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login Error", error.message); // Provide a title for clarity
      } else {
        // Optionally, you can add a navigation action or further processing here
      }
    } catch (error) {
      Alert.alert("Error during login", error.message); // Consistent title for errors
    } finally {
      setLoading(false); // Ensure loading state is reset
      Keyboard.dismiss(); // Dismiss the keyboard
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ top: 50 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back 👋</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange} // Use the handler function
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={handlePasswordChange} // Use the handler function
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>
        <Pressable
          onPress={loginWithEmail}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
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

export default Login;
