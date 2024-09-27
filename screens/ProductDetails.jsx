import {
  Alert, // Import Alert for error messages
  Image,
  SafeAreaView,
  Text,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";

export default function ProductDetails({ route, navigation }) {
  // Get the dimensions of the screen
  const { height, width } = Dimensions.get("window");

  // Extract product details from route.params
  const { item } = route.params;

  // State variables for size and quantity
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [modalVisible, setModalVisible] = useState(false);
  const [sizeOptions] = useState(["S", "M", "L", "XL"]);

  const handleContinue = () => {
    if (!selectedSize) {
      Alert.alert("Error", "Please select a size before continuing.");
    } else {
      navigation.navigate("CheckOut", {
        quantity,
        selectedSize,
        productDetails: item,
      });
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <ScrollView style={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            style={{
              height: 30,
              width: 30,
              borderRadius: 100,
              marginRight: 10,
            }}
            source={require("../assets/nike.jpg")} // Placeholder image for store logo
          />
          <Text style={{ fontSize: 16 }}>{item.storeName}</Text>
        </View>
        <Image
          style={{
            height: height * 0.5,
            width: width * 0.9,
            alignSelf: "center",
            borderRadius: 10,
            marginBottom: 10,
          }}
          source={{ uri: item.productImage }} // Use the product image from the params
        />
        <Text style={{ fontWeight: "500", fontSize: 22, marginBottom: 15 }}>
          {item.productName}
        </Text>
        <Text style={{ fontWeight: "500", fontSize: 20, marginBottom: 20 }}>
          ${item.productPrice}
        </Text>

        <View>
          <Text style={{ fontWeight: "500", marginBottom: 5 }}>
            Description:
          </Text>
          <Text style={{ fontWeight: "400", marginBottom: 5 }}>
            {item.productDescription}
          </Text>
        </View>

        {/* Store Location */}
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontWeight: "500", marginBottom: 5 }}>
            Store Location:
          </Text>
          <Text style={{ fontWeight: "400" }}>
            {item.city}, {item.state}
          </Text>
        </View>

        {/* Size Dropdown */}
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontWeight: "500", marginBottom: 5 }}>
            Select Size:
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: selectedSize ? "#333" : "#aaa" }}>
              {selectedSize || "Select Size"}
            </Text>
          </TouchableOpacity>
          {/* Size Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.7)", // Black background with transparency
              }}
            >
              <View
                style={{
                  width: width * 0.8,
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 20,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                  Select Size
                </Text>
                <FlatList
                  data={sizeOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedSize(item);
                        setModalVisible(false);
                      }}
                      style={{
                        padding: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ccc",
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    backgroundColor: "#007BFF",
                    borderRadius: 5,
                    padding: 10,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* Quantity Input */}
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontWeight: "500", marginBottom: 5 }}>Quantity:</Text>
          <TextInput
            style={{
              height: 50,
              width: width * 0.9,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              paddingHorizontal: 10,
            }}
            keyboardType="numeric"
            value={quantity}
            onChangeText={(text) => setQuantity(text)}
          />
        </View>
        <TouchableOpacity
          onPress={handleContinue}
          style={{
            backgroundColor: "#544AF4",
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 15,
            marginVertical: 10, // Space between buttons
            width: width * 0.8, // Set fixed width for consistency
            alignItems: "center",
            alignSelf: "center",
            marginBottom: 100,
          }}
          accessibilityLabel="Continue to checkout"
        >
          <Text
            style={{
              fontSize: 16,
              color: "white",
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
