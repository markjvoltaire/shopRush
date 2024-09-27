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
import Checkout from "../screens/Checkout";
import PaymentScreen from "../screens/PaymentScreen";
import PostProduct from "../screens/PostProduct";
import StoreHome from "../screens/StoreHome";
import ManageOrder from "../screens/ManageOrder";
import DriverHome from "../screens/DriverHome";
import DeliveryOffering from "../screens/DeliveryOffering";
import DriverManageOrder from "../screens/DriverManageOrder";
import ActiveOrder from "../screens/ActiveOrders";

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
      <Stack.Screen
        name="Home"
        component={
          user.role === "store"
            ? StoreHome
            : user.role === "shopper"
            ? Home
            : DriverHome
        }
      />

      <Stack.Screen
        name="ActiveOrder"
        component={ActiveOrder}
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

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle: "",
          headerTransparent: true,
          headerTitleStyle: {},
          headerTintColor: "#000",
          headerBackTitleStyle: {
            color: "#000",
          },
        }}
      />

      <Stack.Screen
        name="DeliveryOffering"
        component={DeliveryOffering}
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle: "Delivery Offering",
          headerTransparent: true,
          headerTitleStyle: {},
          headerTintColor: "#000",
          headerBackTitleStyle: {
            color: "#000",
          },
        }}
      />

      <Stack.Screen
        name="ManageOrder"
        component={ManageOrder}
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle: "Manage Order",
          headerTransparent: true,
          headerTitleStyle: {},
          headerTintColor: "#000",
          headerBackTitleStyle: {
            color: "#000",
          },
        }}
      />

      <Stack.Screen
        name="DriverManageOrder"
        component={DriverManageOrder}
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle: "Manage Order",
          headerTransparent: true,
          headerTitleStyle: {},
          headerTintColor: "#000",
          headerBackTitleStyle: {
            color: "#000",
          },
        }}
      />

      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle: "Review & Pay",
          headerTransparent: true,
          headerTitleStyle: {},
          headerTintColor: "#000",
          headerBackTitleStyle: {
            color: "#000",
          },
        }}
      />

      <Stack.Screen
        name="CheckOut"
        component={Checkout}
        options={{
          headerShown: true,
          headerBackTitleStyle: {
            color: "red",
          },
          headerTitle: "",
          headerTransparent: true,
          headerTitleStyle: {},
          headerTintColor: "#000",
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

  const PostStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Post"
          component={PostProduct}
          options={{
            headerShown: false,
            headerTitle: "Post",
            tabBarVisible: false,
            headerBackTitle: "Back", // Customizing the back button text
            headerTintColor: "black", // Changing the color of the back button text
          }}
        />
      </Stack.Navigator>
    );
  };

  const ActiveOrdersStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="ActiveOrder"
        component={ActiveOrder}
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
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false, // Hides label for all tabs
        tabBarStyle: {
          position: "absolute", // To allow customizing size and shape
          bottom: 20, // Adjust position from the bottom
          left: 20, // Adjust position from the left
          right: 20, // Adjust position from the right
          height: 60, // Set height of the tab bar
          borderRadius: 15, // Add border radius to the tab bar
          backgroundColor: "#fff", // Tab background color
          elevation: 5, // Adds shadow on Android
          shadowOpacity: 0.3, // Adjusts shadow opacity for iOS
        },
      }}
    >
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
              style={{ width: size, height: size, top: 10 }}
            />
          ),
        }}
      />

      {user.role === "store" ? (
        <Tab.Screen
          name="PostStack"
          component={PostStack}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, size }) => (
              <Image
                source={
                  focused
                    ? require("../assets/PlusActive.png")
                    : require("../assets/Plus.png")
                }
                style={{ width: size, height: size, top: 10 }}
              />
            ),
          }}
        />
      ) : null}

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
              style={{ width: size, height: size, top: 10 }}
            />
          ),
        }}
      />

      {/* {user.role === "store" ? (
        <Tab.Screen
          name="ActiveOrder"
          component={ActiveOrder}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, size }) => (
              <Image
                source={
                  focused
                    ? require("../assets/Calendar.png")
                    : require("../assets/CalendarNotActive.png")
                }
                style={{ width: size, height: size, top: 10 }}
              />
            ),
          }}
        />
      ) : null} */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
