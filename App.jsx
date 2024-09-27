import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";

import { Image, Text, View, Dimensions } from "react-native";

import { useFonts } from "expo-font";
import { supabase } from "./services/supabase";
import Auth from "./auth/Auth";
import NoAuth from "./auth/NoAuth";
import { UserProvider } from "./useContext/userContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import { NotificationProvider } from "./useContext/NotificationContext";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const handleAuthStateChange = (_event, session) => {
      if (_event === "SIGNED_IN") {
        setAuth(session);
      } else if (_event === "SIGNED_OUT") {
        setAuth(null);
      }
    };

    const session = supabase.auth.session();
    setAuth(session);

    // Subscribe to authentication state changes
    const unsubscribe = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  });

  return (
    <StripeProvider
      merchantDisplayName="Tizly"
      merchantIdentifier="merchant.com.tizly.TizlyNative" // The Merchant ID you created
      publishableKey="pk_test_51PVMhrJ0o91xj4miuVh7rhXrOWNTtC1conZos5lB4uC5szMkZDTbQOurUFxLJEQKO3d9QQ29nDrjHKTVyXZ6NMI800pqZVCizt"
    >
      <UserProvider>
        <NavigationContainer>
          {auth ? (
            <NotificationProvider>
              <Auth />
            </NotificationProvider>
          ) : (
            <NoAuth />
          )}
        </NavigationContainer>
      </UserProvider>
    </StripeProvider>
  );
}

export default App;
