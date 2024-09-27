import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../screens/Welcome";
import SignUp from "../screens/SignUp";
import Login from "../screens/Login";
import EnterName from "../screens/EnterName";
import ProfileType from "../screens/ProfileType";
import Name from "../screens/Name";
import NoAuthAddLocation from "../screens/AddAddress";
import AddCity from "../screens/AddCity";
import Dob from "../screens/Dob";
import PaymentIntro from "../screens/PaymentIntro";
import FinancialInfo from "../screens/Ssn";
import BusinessSignUp from "../screens/BusinessSignUp";

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
        name="ProfileType"
        component={ProfileType}
        options={{
          headerBackTitle: "Back",
          headerTitle: "Account Type",
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
        name="Name"
        component={Name}
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
        name="AddAddress"
        component={NoAuthAddLocation}
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
        name="AddCity"
        component={AddCity}
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
        name="Dob"
        component={Dob}
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
        name="PaymentIntro"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Verification",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
        component={PaymentIntro}
      />

      <Stack.Screen
        name="BusinessSignUp"
        component={BusinessSignUp}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Verification",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
        }}
      />

      <Stack.Screen
        name="Ssn"
        component={FinancialInfo}
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: "Verification",
          headerTintColor: "black",
          headerBackTitle: "Go Back",
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
