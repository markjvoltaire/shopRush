import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { supabase } from "../services/supabase";

import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../useContext/userContext";

export default function BusinessSignUp({ route, navigation }) {
  const { routingNumber, accountNumber, ssn } = route.params;

  const {
    address,
    city,
    firstName,
    lastName,
    latitude,
    longitude,
    state,
    type,
    zipCode,
  } = route.params.route.params.route.params.userInfo;

  const { user, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState(false);


  const mcc = "5699";

  const month = route.params.route.params.route.params.month;
  const day = route.params.route.params.route.params.day;
  const year = route.params.route.params.route.params.year;

  const signUpWithEmail = async (json) => {
    setModal(true);
    // Input validation
    if (password.length < 8) {
      Alert.alert("Password should be 8 or more characters");
      console.log("LINE 28");
      setModal(false);
      return;
    }

    if (!email) {
      Alert.alert("Please fill in all field inputs");
      console.log("LINE 35");
      setModal(false);

      return;
    }

    try {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (!error) {
        const userId = supabase.auth.currentUser.id;
        const resp = await supabase.from("profiles").insert([
          {
            firstName: firstName,
            lastName: lastName,
            userId: userId,
            email: email,
            city: city,
            state: state,
            latitude: latitude,
            longitude: longitude,
            stripeAccountId: json.account,
            role: type,
          },
        ]);
        console.log("resp", resp);
        setUser(resp.body[0]);
        setModal(false);
        return resp;
      } else {
        console.log("LINE 67");
        setModal(false);
        Alert.alert(error.message);
        console.error("Error during sign-up:", error);
      }

      return { user, error };
    } catch (error) {
      console.log("LINE 75");
      setModal(false);
      console.error("An error occurred during sign-up:", error);
      Alert.alert("An error occurred. Please try again later.");

      return { user: null, error };
    }
  };

  const createAccount = async (resp) => {
    setModal(true);

    try {
      const response = await fetch("http://localhost:8080/account", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          mcc: mcc,
          ssn: ssn,
          address: address,
          city: city,
          state: state,
          firstName: firstName,
          lastName: lastName,
          zipCode: zipCode,
          accountNumber: accountNumber,
          routingNumber: routingNumber,
          phoneNumber: phoneNumber,
          month: month,
          day: day,
          year: year,
        }),
      });

      if (!response.ok) {
        setModal(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const json = await response.json();

          await signUpWithEmail(json);
          if (json.error) {
            Alert.alert(json.error);
            setModal(false);
          }
        } else {
          setModal(false);
          const text = await response.text();
          console.warn("Received non-JSON response:", text);
          setError("Unexpected response format.");
        }
      }
    } catch (error) {
      setModal(false);
      console.error("Error creating account:", error);
    }
  };

  const handleSignUp = async () => {
    await createAccount();
  };

  return (
    <>
      <SafeAreaView
        style={{ backgroundColor: "#4A3AFF", padding: 15, height: 10 }}
      >
        <View style={{ width: 90 }}></View>
      </SafeAreaView>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 25,
            marginBottom: 30,
            color: "white",
            fontWeight: "800",
            width: "100%",
          }}
        >
          Complete your registration!
        </Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Business Name"
            value={username}
            onChangeText={(text) => setUserName(text)}
          />

          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Phone Number"
            keyboardType="number-pad"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity
            onPress={() => handleSignUp()}
            style={styles.signupButton}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.forgotPasswordText}>Login Here</Text>
        </TouchableOpacity>

        <Modal animationType={"fade"} visible={modal}>
          <View style={{ flex: 1, backgroundColor: "#4A3AFF" }}>
            <View style={{ top: 200 }}>
              <LottieView
                autoPlay
                style={{ height: 300, width: 300, alignSelf: "center" }}
                source={require("../assets/lottie/3WhiteDots.json")}
              />
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A3AFF",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  forgotPassword: {
    marginBottom: 20,
    alignSelf: "center",
  },
  forgotPasswordText: {
    color: "#4A3AFF",
    fontSize: 16,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FAFAFA",
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
