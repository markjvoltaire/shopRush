import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useUser } from "../useContext/userContext";

export default function AppHeader() {
  const { user } = useUser();
  return (
    <Text
      style={{
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        color: "#333",
        left: 10,
      }}
    >
      Hello {user.firstName}
    </Text>
  );
}

const styles = StyleSheet.create({});
