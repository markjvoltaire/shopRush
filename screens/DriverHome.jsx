import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  AppState,
  Alert,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import * as Location from "expo-location";
import { supabase } from "../services/supabase";
import { useUser } from "../useContext/userContext";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Audio } from "expo-av";

export default function DriverHome({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [storeLocation, setStoreLocation] = useState(null); // State for store location
  const [storeAddress, setStoreAddress] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null); // State for delivery location
  const [showUser, setShowUser] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentOffer, setCurrentOffer] = useState();
  const mapRef = useRef(null);
  const { user } = useUser(); // Assume user has userId
  const [sound, setSound] = useState();

  const { height, width } = Dimensions.get("window");

  const playSound = async () => {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/chime.mp3") // Ensure the path to your sound file is correct
    );

    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync(); // Play the sound
  };

  // Unload the sound from memory when the component unmounts
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied.");
      setLoading(false);
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    setLoading(false);
  };

  const watchLocation = async () => {
    return Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 50,
      },
      async (newLocation) => {
        setLocation(newLocation);

        if (isOnline) {
          const { error } = await supabase.from("driver_location").upsert({
            driverId: user.userId,
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            expo_push_token: user.expo_push_token,
          });

          if (error) {
            console.error("Error updating location:", error);
          }
        }
      }
    );
  };

  const goOnline = async () => {
    setIsOnline(true);

    if (location) {
      const { error } = await supabase.from("driver_location").upsert({
        driverId: user.userId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        expo_push_token: user.expo_push_token,
      });

      if (error) {
        console.error("Error setting initial location:", error);
      }
    }

    watchLocation();
  };

  const declineOffer = async () => {
    const { data } = await supabase
      .from("orders")
      .update({ driverId: null })
      .eq("driverId", user.userId)
      .eq("orderId", currentOffer.orderId);

    setShowModal(false); // Close the modal
    setStoreLocation(null); // Clear the store location marker
    setDeliveryLocation(null); // Clear the delivery location marker
    setShowUser(true);
    setCurrentOffer(null);
    return data;
  };

  const goOffline = async () => {
    setIsOnline(false);
    const { error } = await supabase
      .from("driver_location")
      .delete()
      .eq("driverId", user.userId);

    if (error) {
      console.error("Error removing location:", error);
    }
  };

  // Fetch coordinates from the address using Nominatim API
  const getCoordinatesFromAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null; // Return null in case of error
    }
  };

  // Function to adjust the map region to show both markers
  const adjustMapRegion = () => {
    if (mapRef.current && storeLocation && deliveryLocation) {
      // Fit the map to the store and delivery markers
      mapRef.current.fitToSuppliedMarkers(["store", "dropOff"], {
        animated: true,
        edgePadding: {
          top: 10,
          right: 50,
          bottom: 20,
          left: 50,
        },
      });

      // Calculate the center between the store and delivery locations
      const centerLatitude =
        (storeLocation.latitude + deliveryLocation.latitude) / 2;
      const centerLongitude =
        (storeLocation.longitude + deliveryLocation.longitude) / 2;

      // Set the desired zoom level by adjusting the latitudeDelta and longitudeDelta
      const zoomLevel = {
        latitudeDelta: 0.4, // Smaller value = more zoomed in
        longitudeDelta: 0.2, // Adjust based on your preferred zoom level
      };

      // Animate to the region with the desired zoom
      mapRef.current.animateToRegion(
        {
          latitude: centerLatitude,
          longitude: centerLongitude,
          ...zoomLevel,
        },
        100
      ); // Adjust the duration of the animation if needed
    }
  };

  useEffect(() => {
    const subscription = supabase
      .from("orders")
      .on("INSERT", (payload) => {
        if (payload.new.driverId === user.userId) {
          Alert.alert(
            "New Order",
            "A new order has been inserted for this driver."
          );
        }
      })
      .on("UPDATE", async (payload) => {
        if (payload.new.driverId === user.userId) {
          const pickUpAddress = payload.new.storeLocation; // Assuming this is the address string
          const deliveryAddress = payload.new.deliveryLocation; // Assuming this is the address string

          setDeliveryAddress(deliveryAddress);
          setStoreAddress(pickUpAddress);

          // Fetch coordinates for store location
          const storeCoords = await getCoordinatesFromAddress(pickUpAddress);
          // Fetch coordinates for delivery location
          const deliveryCoords = await getCoordinatesFromAddress(
            deliveryAddress
          );
          setCurrentOffer(payload.new);

          setShowUser(false);
          setShowModal(true);
          // Set state for the store and delivery locations
          setStoreLocation(storeCoords);
          setDeliveryLocation(deliveryCoords);
          playSound();
          // Adjust the map region to show both markers
          adjustMapRegion();
        }
      })
      .on("DELETE", (payload) => {
        if (payload.old.driverId === user.userId) {
          Alert.alert(
            "Order Deleted",
            "An order has been deleted for this driver."
          );
        }
      })
      .subscribe();

    // Get the initial location
    getLocation();

    return () => {
      supabase.removeSubscription(subscription); // Clean up the subscription on unmount
    };
  }, [user.userId]); // Add user.userId as a dependency to ensure updates

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            ref={mapRef}
            style={{ height: height }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.4,
              longitudeDelta: 0.2,
            }}
            showsUserLocation={showUser}
            followsUserLocation={true}
          >
            {/* Marker for store location */}
            {storeLocation && (
              <Marker
                coordinate={storeLocation}
                title="Store Location"
                description="Pick up your order here."
                pinColor="blue"
                identifier="store" // Identifier for fitting
              />
            )}

            {/* Marker for delivery location */}
            {deliveryLocation && (
              <Marker
                coordinate={deliveryLocation}
                title="Delivery Location"
                description="Deliver your order here."
                pinColor="green"
                identifier="dropOff" // Identifier for fitting
              />
            )}

            {/* Draw a line between store and delivery locations */}
            {storeLocation && deliveryLocation && (
              <Polyline
                coordinates={[storeLocation, deliveryLocation]}
                strokeColor="#000" // Custom color for the line
                strokeWidth={3} // Custom width for the line
              />
            )}
          </MapView>
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              Latitude: {location.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Longitude: {location.coords.longitude.toFixed(6)}
            </Text>
          </View>
        </>
      ) : null}

      <View style={{ bottom: 210 }}>
        <TouchableOpacity
          style={{
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 15,
            marginVertical: 10,
            width: width * 0.8,
            alignItems: "center",
            alignSelf: "center",
            backgroundColor: "#544AF4",
          }}
          onPress={goOnline} // Call the openMap function on press
        >
          <Text style={styles.payButtonText}>Appear Online</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showModal} animationType="slide">
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.4,
              longitudeDelta: 0.2,
            }}
            showsUserLocation={showUser}
            followsUserLocation={true}
          >
            {/* Marker for store location */}
            {storeLocation && (
              <Marker
                coordinate={storeLocation}
                title="Store Location"
                description="Pick up your order here."
                pinColor="blue"
                identifier="store" // Identifier for fitting
              />
            )}

            {/* Marker for delivery location */}
            {deliveryLocation && (
              <Marker
                coordinate={deliveryLocation}
                title="Delivery Location"
                description="Deliver your order here."
                pinColor="green"
                identifier="dropOff" // Identifier for fitting
              />
            )}

            {/* Draw a line between store and delivery locations */}
            {storeLocation && deliveryLocation && (
              <Polyline
                coordinates={[storeLocation, deliveryLocation]}
                strokeColor="#000" // Custom color for the line
                strokeWidth={3} // Custom width for the line
              />
            )}
          </MapView>
          <View
            style={{
              height: height * 0.6,
              width: width,
              backgroundColor: "white",
              borderRadius: 10,
              position: "absolute",
              bottom: -height * 0.14, // Move the modal just above the bottom
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 20,
              elevation: 5, // For Android shadow effect
              padding: 20,
            }}
          >
            {/* Earnings and Distance/Time Details */}
            <Text style={{ fontWeight: "bold", fontSize: 25, marginBottom: 5 }}>
              $10.00 Guaranteed
            </Text>
            <Text style={{ fontSize: 16, color: "#555", marginBottom: 10 }}>
              Please Drive Safely
            </Text>

            {/* Divider */}
            <View
              style={{
                borderBottomColor: "#ddd",
                borderBottomWidth: 1,
                marginVertical: 10,
              }}
            />

            {/* Pickup and Dropoff Locations */}
            <View>
              <Text
                style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}
              >
                Pickup: {currentOffer ? currentOffer.storeName : null}
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 25 }}
              >
                {storeAddress}
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}
              >
                Delivery
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                {deliveryAddress}
              </Text>
            </View>

            {/* Accept Button */}
            <View style={{ marginTop: height * 0.05 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  borderRadius: 30,
                  backgroundColor: "#544AF4",
                  alignItems: "center",
                  width: width * 0.9,
                  alignSelf: "center",
                }}
                onPress={() => console.log("Offer Accepted")}
              >
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  Accept Offer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Decline Button */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                backgroundColor: "white",
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 20,
                borderColor: "#ddd",
                borderWidth: 1,
              }}
              onPress={declineOffer}
            >
              <Text
                style={{ fontSize: 16, color: "black", fontWeight: "bold" }}
              >
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  map: {
    width: "100%",
    height: "55%",
  },
  coordinatesContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  coordinatesText: {
    fontSize: 16,
  },
});
