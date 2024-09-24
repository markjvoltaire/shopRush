import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";

import { Image, Text, View, Dimensions } from "react-native";

import { useFonts } from "expo-font";
import { supabase } from "./services/supabase";
import Auth from "./auth/Auth";
import NoAuth from "./auth/NoAuth";
import { UserProvider } from "./useContext/userContext";

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
    <UserProvider>
      <NavigationContainer>{auth ? <Auth /> : <NoAuth />}</NavigationContainer>
    </UserProvider>
  );
}

export default App;
