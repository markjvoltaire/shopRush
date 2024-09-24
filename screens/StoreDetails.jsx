import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React from "react";

export default function StoreDetails({ route, navigation }) {
  const { name, city, state } = route.params.item;

  // Dummy data for products
  const products = Array.from({ length: 10 }, (_, index) => ({
    id: index.toString(), // Use string to ensure uniqueness
    productName: "Rosie Hoodie",
    productImage: require("../assets/desi.png"), // Replace with actual image paths as needed
    productPrice: 40,
    storeName: name,
    storeCity: city,
    storeState: state,
  }));

  const renderProduct = ({ item }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("ProductDetails", { productDetails: item })
        }
        accessibilityLabel={`View details for ${item.productName}`}
        accessibilityRole="button"
      >
        <View style={styles.productCard}>
          <Image
            style={styles.productImage}
            source={item.productImage}
            accessible={true}
            accessibilityLabel={item.productName} // Accessibility label for image
          />
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productPrice}>${item.productPrice}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.storeInfoContainer}>
        <Text style={styles.storeName}>{name}</Text>
        <Text style={styles.storeLocation}>
          {city}, {state}
        </Text>
      </View>

      <View style={styles.productsHeaderContainer}>
        <Text style={styles.productsHeader}>All Products</Text>
        <Image
          style={styles.filterIcon}
          source={require("../assets/filter.png")}
        />
      </View>

      <FlatList
        horizontal={false} // Ensure horizontal scrolling is disabled
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display items in two columns
        contentContainerStyle={styles.productList} // Add padding to the list
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  storeInfoContainer: {
    padding: 20,
  },
  storeName: {
    fontWeight: "600",
    fontSize: 24, // Increased font size for better visibility
  },
  storeLocation: {
    color: "grey",
    fontSize: 16, // Increased font size for better visibility
  },
  productsHeaderContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productsHeader: {
    fontWeight: "700",
    fontSize: 20,
  },
  productList: {
    paddingHorizontal: 10,
    alignItems: "center", // Center items within the FlatList
  },
  productCard: {
    padding: 10,
    borderRadius: 8,
    margin: 5, // Adjust margin as needed
  },
  productImage: {
    height: 230,
    width: 170,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: "grey", // Placeholder background
  },
  productName: {
    fontWeight: "400",
    fontSize: 16, // Increased font size for better visibility
  },
  productPrice: {
    fontWeight: "700",
    fontSize: 16, // Increased font size for better visibility
  },
  filterIcon: {
    height: 30,
    width: 30,
  },
});
