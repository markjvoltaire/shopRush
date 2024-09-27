import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";
import { useUser } from "../useContext/userContext";
import { supabase } from "../services/supabase";

const UserProfile = () => {
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // Sign out from Supabase

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Clear user context on logout (uncomment if needed)
      // setUser(null);
      // Optionally navigate to a login screen or perform other actions here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.email || "User"}!</Text>
      <Text style={styles.welcomeText}>Role: {user?.role || "NO ROLE"}</Text>
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default UserProfile;
