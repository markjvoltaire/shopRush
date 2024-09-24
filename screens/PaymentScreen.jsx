import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import LottieView from "lottie-react-native";
import { useStripe } from "@stripe/stripe-react-native";

export default function PaymentScreen({ route }) {
  const stripe = useStripe();

  const {
    address,
    formattedAddress,
    productDetails,
    quantity,
    selectedSize,
    productImage,
    latitude,
    longitude,
  } = route.params;
  const { height, width } = Dimensions.get("window");
  const [processing, setProcessing] = useState(false);

  // Function to handle payment
  const handlePayment = () => {
    setProcessing(true);

    // Set processing to false after 4 seconds
    setTimeout(() => {
      setProcessing(false);
    }, 4000);
  };

  const handlePayPress = async () => {
    setProcessing(true);
    const sellerStripeId = "acct_1PqS4EQwjiM7qgln";
    try {
      const response = await fetch("https://tizlyexpress.onrender.com/pay", {
        method: "POST",
        body: JSON.stringify({
          servicePrice: productDetails.productPrice + 10,
          sellerStripeId: sellerStripeId,
        }), // Multiply price by hours if byHour is true
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data", data);
      if (!response.ok) {
        Alert.alert(data.message);
        setProcessing(false);
        return;
      }
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        returnURL: null,
      });
      if (initSheet.error) {
        Alert.alert(initSheet.error.message);
        setProcessing(false);
        return;
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) {
        console.log("presentSheet", presentSheet);
        setProcessing(false);
        return;
      }
      const order = await uploadOrder();
      Alert.alert("Payment complete, thank you!");

      setProcessing(false);

      return order;
    } catch (err) {
      console.error(err);
      Alert.alert("Something went wrong, try again later!");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.address}>{formattedAddress}</Text>
        </View>
        <MapView
          scrollEnabled={false}
          style={{
            width: "100%",
            height: "75%",
            marginBottom: 20,
            borderRadius: 10,
            overflow: "hidden",
          }} // Apply the animated transform
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
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

        {/* Product Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.productContainer}>
            <Image
              source={require("../assets/desi.png")}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {productDetails.productName}
              </Text>

              <Text>Size: {selectedSize}</Text>
              <Text>Quantity: {quantity}</Text>
              <Text>Price: ${productDetails.productPrice}</Text>
              <Text>Delivery Fee: $10</Text>
              <Text>Delivery time: 30 mins - 1 hour</Text>
            </View>
          </View>
        </View>

        {/* Payment Button */}
      </ScrollView>
      <View
        style={{
          padding: 10,
          borderTopWidth: 0.2,
          borderColor: "#ccc",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
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
          onPress={handlePayPress}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={processing} animationType="fade">
        <SafeAreaView style={styles.modalContainer}>
          <LottieView
            style={styles.animation}
            source={require("../assets/lottie/3WhiteDots.json")}
            autoPlay
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  modalContainer: {
    backgroundColor: "#4A3AFF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  detailsContainer: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  payButton: {
    marginTop: 20,
    backgroundColor: "#544AF4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
