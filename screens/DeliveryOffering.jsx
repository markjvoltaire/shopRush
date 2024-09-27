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

const DeliveryOffering = ({ route, navigation }) => {
  const { deliveryLocation, storeLocation, storeId, expo_push_token, orderId } =
    route.params.payload.new; // Destructure here
  const { height, width } = Dimensions.get("window");

  console.log("routese", route.params.payload.new);

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

  async function driverOnTheWay() {
    let data;

    try {
      // Update the order status in Supabase
      const { data: updatedData, error } = await supabase
        .from("orders") // Replace with your table name
        .update({ status: "Driver On The Way" }) // Update the status to 'Awaiting Driver'
        .eq("orderId", orderId); // Match the order by its ID

      if (error) {
        throw new Error(`Error updating order: ${error.message}`); // Throw a more descriptive error
      }

      data = updatedData; // Store the updated data
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      // Send a notification (your existing function)
      await sendNotification();
    }

    return data; // Return the updated data or undefined if an error occurred
  }

  const sendNotification = async (body, title) => {
    try {
      // Notification message
      const message = {
        to: expo_push_token,
        sound: "default",
        title: "A Driver is on The Way!",
        body: "a driver will be picking it up shortly.",
      };

      // Send the notification
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
        body: JSON.stringify(message),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  // Function to open the GPS app
  const openMap = async () => {
    await sendNotification();
    await driverOnTheWay();
    if (storeCoords) {
      const lat = storeCoords.latitude;
      const lon = storeCoords.longitude;
      let url;

      // Check the platform
      if (Platform.OS === "ios") {
        // For iOS, use Apple Maps
        url = `http://maps.apple.com/?daddr=${lat},${lon}`;
      } else {
        // For Android, use Google Maps
        url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
      }

      Linking.openURL(url).catch((err) => {
        console.error("Failed to open maps: ", err);
      });
    }
    navigation.goBack();
  };

  // Handle loading state in the return
  if (loading || !currentCoords || !deliveryCoords || !storeCoords) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show a spinner
  }

  const initialRegion = {
    latitude: (currentCoords.latitude + deliveryCoords.latitude) / 2,
    longitude: (currentCoords.longitude + deliveryCoords.longitude) / 2,
    latitudeDelta: 0.2, // Adjusted to zoom out
    longitudeDelta: 0.2, // Adjusted to zoom out
  };

  // Button styles to avoid duplication
  const buttonStyle = {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginVertical: 10,
    width: width * 0.9,
    alignItems: "center",
    alignSelf: "center",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <MapView
          style={styles.map}
          scrollEnabled={false}
          initialRegion={initialRegion}
        >
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
        </MapView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pick Up Address</Text>
          <Text style={styles.address}>{storeLocation}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.address}>{deliveryLocation}</Text>
        </View>
        <TouchableOpacity style={[buttonStyle, { backgroundColor: "black" }]}>
          <Text style={styles.payButtonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[buttonStyle, { backgroundColor: "#544AF4" }]}
          onPress={openMap} // Call the openMap function on press
        >
          <Text style={styles.payButtonText}>Accept</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    padding: 20,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
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
  },
  map: {
    width: "100%",
    height: "75%",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default DeliveryOffering;
