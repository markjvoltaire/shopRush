import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../screens/Welcome";
import SignUp from "../screens/SignUp";
import Login from "../screens/Login";
import EnterName from "../screens/EnterName";

const Stack = createNativeStackNavigator();

export default function NoAuth() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen
        name="EnterName"
        component={EnterName}
        options={{
          headerBackTitle: "Back",
          headerTitle: "Sign Up",
          headerShown: true, // Ensures the header is visible
          headerTransparent: true, // Makes the header transparent
          headerTitleStyle: {
            color: "black", // Set title color to white
          },
          headerTintColor: "#000", // Set the back button icon color to black
          headerBackTitleStyle: {
            color: "black", // Set the back button text color to black
          },
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerBackTitle: "Back",
          headerTitle: "Sign Up",
          headerShown: true, // Ensures the header is visible
          headerTransparent: true, // Makes the header transparent
          headerTitleStyle: {
            color: "black", // Set title color to white
          },
          headerTintColor: "#000", // Set the back button icon color to black
          headerBackTitleStyle: {
            color: "black", // Set the back button text color to black
          },
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerBackTitle: "Back",
          headerTitle: "Log in",
          headerShown: true, // Ensures the header is visible
          headerTransparent: true, // Makes the header transparent

          headerTintColor: "#000", // Set the back button icon color to black
          headerBackTitleStyle: {
            color: "#000", // Set the back button text color to black
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
