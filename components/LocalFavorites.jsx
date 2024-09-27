import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import { supabase } from "../services/supabase";

export default function LocalFavorites({ navigation }) {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      if (data) {
        setProductList(data);
      }
    }
    fetchProducts();
  }, []);

  const getProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw new Error(`Error fetching products: ${error.message}`);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => navigation.navigate("ProductDetails", { item })}>
      <View style={styles.productContainer}>
        <Image source={{ uri: item.productImage }} style={styles.image} />
        <Text style={styles.name}>{item.productName}</Text>
        <Text>{item.storeName}</Text>
        <Text>{`${item.city}, ${item.state}`}</Text>
        <Text>Price: ${item.productPrice}</Text>
        <Text>{item.productDescription}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={productList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  productContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
