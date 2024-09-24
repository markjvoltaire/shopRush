import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import Categories from "../components/Categories";
import NewStores from "../components/NewStores";

export default function Home({ navigation }) {
  const { height, width } = Dimensions.get("window");

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <AppHeader />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Stores and Products"
        />
      </SafeAreaView>
      <ScrollView style={{ backgroundColor: "white", flex: 1, padding: 10 }}>
        <Image
          style={{
            height: height * 0.2,
            width: width * 0.97,
            borderRadius: 5,
            alignSelf: "center",
            marginBottom: 10,
            bottom: 10,
          }}
          source={require("../assets/Frame.png")}
          resizeMode="cover" // Ensure consistent image rendering
        />

        <Text style={styles.categoryText}>Shop by Category</Text>

        <Categories navigation={navigation} />

        <Text style={styles.categoryText}>New to Shop Rush</Text>

        <NewStores navigation={navigation} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  categoryText: {
    marginBottom: 20,
    fontWeight: "700",
    color: "#333",
    fontSize: 17,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    padding: 15,
    width: "95%",
    alignSelf: "center", // Aligns the input to the start
    fontSize: 16,
    backgroundColor: "#fff",
    top: 20,
  },
});
