import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Pressable,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import HomeCard from "./HomeCard";

export default function Checkout({ route, navigation }) {
  const { productDetails, quantity, selectedSize } = route.params;
  const {
    id,
    productImage,
    productName,
    productPrice,
    storeCity,
    storeName,
    storeState,
  } = productDetails;

  // State for user's location and address
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState("");
  const { height, width } = Dimensions.get("window");
  const slideUpAnim = useRef(new Animated.Value(height)).current;
  const keyboardOffsetAnim = useRef(new Animated.Value(0)).current; // New animated value for keyboard offset
  const [keyBoardActive, setKeyBoardActive] = useState(false);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      // Get the user's current location
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Reverse geocoding to get address from coordinates
      let addr = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setAddress(addr[0]); // Store the first result of the address

      // Format the address and set it to a variable
      const formatted = `${addr[0].streetNumber} ${addr[0].street} ${addr[0].city} ${addr[0].region} ${addr[0].postalCode}`;
      setFormattedAddress(formatted);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    // Animate the initial slide up of the card
    Animated.timing(slideUpAnim, {
      toValue: height * 0.65,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [slideUpAnim]);

  useEffect(() => {
    // Animate the keyboard offset when keyboard becomes active or inactive
    Animated.timing(keyboardOffsetAnim, {
      toValue: keyBoardActive ? -220 : 0, // Adjust the value to animate the view up or down
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [keyBoardActive]);

  // Handle location confirmation
  const handleConfirmLocation = () => {
    if (!location) {
      Alert.alert("Error", "Unable to get location. Please try again.");
      return;
    }
    // Navigate to the next step, e.g., payment or review order
    navigation.navigate("PaymentScreen", {
      location,
      address,
      productDetails,
      quantity,
      selectedSize,
      formattedAddress,
      productImage,
      productName,
      productPrice,
      storeCity,
      storeName,
      storeState,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{errorMsg}</Text>
      </SafeAreaView>
    );
  }
  console.log("keyBoardActive", keyBoardActive);

  return (
    <View style={styles.container}>
      {location && (
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={{
            width: "100%",
            height: "105%",
            marginBottom: 20,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <MapView
            style={[
              styles.map,
              { transform: [{ translateY: keyBoardActive ? -100 : 0 }] },
            ]} // Apply the animated transform
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0009, // Zoom in more
              longitudeDelta: 0.0009, // Zoom in more
            }}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {/* Add a marker at the user's location */}
            {/* <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title={"Your Location"}
              description={"This is where we will deliver your order."}
            /> */}
          </MapView>
        </Pressable>
      )}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View
          style={[
            {
              position: "absolute",
              backgroundColor: "white",
              width: width,
              height: height * 0.57,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              elevation: 5, // Android shadow
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 9.84,
            },
            {
              transform: [
                { translateY: slideUpAnim },
                { translateY: keyboardOffsetAnim }, // Apply keyboard offset animation
              ],
            },
          ]}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 20,
              color: "#333",
              marginBottom: 20,
              left: width * 0.07,
              top: 15,
            }}
          >
            Confirm delivery location
          </Text>
          <View style={{ padding: 20 }}>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              autoCapitalize="none"
              value={formattedAddress}
              onChangeText={setFormattedAddress}
              onFocus={() => setKeyBoardActive(true)}
              onBlur={() => setKeyBoardActive(false)}
            />
          </View>
          <TouchableOpacity
            onPress={handleConfirmLocation}
            style={{
              backgroundColor: "#544AF4",
              paddingVertical: 15,
              paddingHorizontal: 40,
              borderRadius: 15,
              marginVertical: 10,
              width: width * 0.8,
              alignItems: "center",
              alignSelf: "center",
            }}
            accessibilityLabel="Confirm location"
            accessibilityHint="Confirm delivery location"
          >
            <Text style={styles.buttonText}>Confirm location</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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

  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: "75%",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  addressContainer: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  addressText: {
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#00C853",
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
