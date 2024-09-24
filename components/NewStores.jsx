import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";

const storeData = [
  {
    id: "1",
    name: "Nike",
    city: "Miami",
    state: "Florida",
    imageUrl: require("../assets/nike.jpg"), // Local image
  },
  {
    city: "Miami",
    state: "Florida",
    id: "2",
    name: "H&M",
    imageUrl: require("../assets/H&M-Logo.png"), // Local image
  },
  {
    city: "Miami",
    state: "Florida",
    id: "3",
    name: "JD Sports",
    imageUrl: require("../assets/JD.png"), // Local image
  },
];

export default function NewStores({ navigation }) {
  const renderItem = ({ item }) => (
    <Pressable onPress={() => navigation.navigate("StoreDetails", { item })}>
      <View style={styles.storeContainer}>
        <Image
          source={
            typeof item.imageUrl === "string"
              ? { uri: item.imageUrl } // Remote image
              : item.imageUrl // Local image
          }
          style={styles.storeImage}
        />
        <Text style={styles.storeName}>{item.name}</Text>
        <Text style={{ fontWeight: "400" }}>
          {item.city}, {item.state}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={storeData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  storeContainer: {
    marginHorizontal: 5,
  },
  storeImage: {
    width: Dimensions.get("window").width * 0.7,
    height: 200,
    borderRadius: 10,
    borderWidth: 0.3,
  },
  storeName: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
  },
});
