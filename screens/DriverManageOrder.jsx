import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { supabase } from "../services/supabase";
import { useUser } from "../useContext/userContext";

// Get dimensions at the top
const { height, width } = Dimensions.get("window");

const haversineDistanceInMiles = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const R = 3958.8; // Radius of the Earth in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in miles
};

const calculateEstimatedTimeInMinutes = (distanceInMiles, speedMph = 30) => {
  return Math.round((distanceInMiles / speedMph) * 60); // Convert to minutes
};

const DriverManageOrder = ({ route, navigation }) => {
  const { deliveryLocation, storeLocation, orderId, customerId } =
    route.params.item; // Destructure here
  console.log("route", route);
  const { user } = useUser();

  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [storeCoords, setStoreCoords] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [distances, setDistances] = useState({
    toStore: null,
    toDelivery: null,
  });
  const [estimatedTimes, setEstimatedTimes] = useState({
    toStore: null,
    toDelivery: null,
  });
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchCoordinates = async (location, setCoords) => {
    try {
      const result = await Location.geocodeAsync(location);
      if (result.length > 0) {
        setCoords(result[0]);
      } else {
        console.error(`No results found for ${location}.`);
      }
    } catch (error) {
      console.error("Error getting coordinates: ", error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  useEffect(() => {
    fetchCoordinates(deliveryLocation, setDeliveryCoords);
    fetchCoordinates(storeLocation, setStoreCoords);
  }, [deliveryLocation, storeLocation]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentCoords(location.coords);
      } catch (error) {
        console.error("Error getting location: ", error);
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (deliveryCoords && storeCoords && currentCoords) {
      const distanceToStore = haversineDistanceInMiles(
        currentCoords,
        storeCoords
      );
      const distanceToDelivery = haversineDistanceInMiles(
        storeCoords,
        deliveryCoords
      );

      setDistances({
        toStore: distanceToStore,
        toDelivery: distanceToDelivery,
      });

      setEstimatedTimes({
        toStore: calculateEstimatedTimeInMinutes(distanceToStore),
        toDelivery: calculateEstimatedTimeInMinutes(distanceToDelivery),
      });
    }
  }, [currentCoords, deliveryCoords, storeCoords]);

  const openMap = async () => {
    try {
      // Update the order status in Supabase
      const { data, error } = await supabase
        .from("profiles") // Replace with your table name
        .update({ currentOrder: orderId }) // Update the status to 'Ready' or any other status
        .eq("userId", user.userId); // Make sure to match the order by its ID

      if (error) {
        throw error; // Handle any errors
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      // Send a notification (your existing function)
      //   await sendNotification();

      navigation.goBack();
    }

    if (storeCoords) {
      const lat = storeCoords.latitude;
      const lon = storeCoords.longitude;
      let url;

      // Check the platform
      if (Platform.OS === "ios") {
        url = `http://maps.apple.com/?daddr=${lat},${lon}`;
      } else {
        url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
      }

      Linking.openURL(url).catch((err) => {
        console.error("Failed to open maps: ", err);
      });
    }
  };

  // Handle loading state in the return
  if (loading || !currentCoords || !deliveryCoords || !storeCoords) {
    return (
      <ActivityIndicator size="large" color="#544AF4" style={styles.loader} />
    ); // Show a spinner
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* <MapView style={styles.map} initialRegion={initialRegion}>
          <Marker
            coordinate={currentCoords}
            title="Your Location"
            pinColor="blue"
          />
          <Marker
            coordinate={deliveryCoords}
            title="Delivery Location"
            description={deliveryLocation}
          />
          <Marker
            coordinate={storeCoords}
            title="Store Location"
            description={storeLocation}
          />
          <Polyline
            coordinates={[currentCoords, storeCoords]}
            strokeColor="#00f"
            strokeWidth={4}
          />
          <Polyline
            coordinates={[storeCoords, deliveryCoords]}
            strokeColor="#f00"
            strokeWidth={4}
          />
        </MapView> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pick Up Address</Text>
          <Text style={styles.address}>{storeLocation}</Text>
          <Text style={styles.info}>
            Estimated Time to Store: {estimatedTimes.toStore || "N/A"} minutes
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.address}>{deliveryLocation}</Text>
          <Text style={styles.info}>
            Estimated Time to Delivery: {estimatedTimes.toDelivery || "N/A"}{" "}
            minutes
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#544AF4" }]}
          onPress={openMap} // Call the openMap function on press
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9", // Lighter background for better contrast
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    padding: 20,
  },
  section: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: "#777",
  },
  map: {
    height: height * 0.4, // Fixed height for the MapView
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 100,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default DriverManageOrder;
