import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/Home";
import UserProfile from "../screens/UserProfile";
import { getUser } from "../services/user";
import { useUser } from "../useContext/userContext";
import StoreDetails from "../screens/StoreDetails";
import ProductDetails from "../screens/ProductDetails";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Auth() {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();

  const fetchUser = async () => {
    try {
      const resp = await getUser();
      setUser(resp[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle: "Details",
          headerTransparent: true,
          headerTitleStyle: {},
          headerTintColor: "#000",
          headerBackTitleStyle: {
            color: "#000",
          },
        }}
      />
      <Stack.Screen
        name="StoreDetails"
        component={StoreDetails}
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle: "",
          headerTransparent: true,
          headerTitleStyle: {
            color: "#fff",
          },
          headerTintColor: "#000",
          headerBackTitleStyle: {
            color: "#000",
          },
        }}
      />
    </Stack.Navigator>
  );

  const UserProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerBackTitle: "Back",
          headerTitle: "",
          headerTransparent: true,
          headerTitleStyle: {
            color: "#fff",
          },
          headerTintColor: "#000",
          headerBackTitleStyle: {
            color: "#000",
          },
        }}
      />
    </Stack.Navigator>
  );

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={
                focused
                  ? require("../assets/homeActive.png")
                  : require("../assets/home.png")
              }
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="UserProfileStack"
        component={UserProfileStack}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={
                focused
                  ? require("../assets/profileActive.png")
                  : require("../assets/profile.png")
              }
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
