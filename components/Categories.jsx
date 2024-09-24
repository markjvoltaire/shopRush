import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

export default function Categories() {
  return (
    <View style={{ marginBottom: 45 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Image
            style={{
              height: 110,
              width: 110,
              borderRadius: 10,
              marginBottom: 10,
              backgroundColor: "#D9D9D9",
            }}
            source={require("../assets/shoes.jpg")}
          />

          <Text style={{ alignSelf: "center", fontWeight: "700" }}>shoes</Text>
        </View>

        <View>
          <Image
            style={{
              height: 110,
              width: 110,
              borderRadius: 10,
              marginBottom: 10,
              backgroundColor: "#D9D9D9",
            }}
            source={require("../assets/shirts.jpg")}
          />

          <Text style={{ alignSelf: "center", fontWeight: "700" }}>tops</Text>
        </View>

        <View>
          <Image
            style={{
              height: 110,
              width: 110,
              borderRadius: 10,
              marginBottom: 10,
              backgroundColor: "#D9D9D9",
            }}
            source={require("../assets/jeans.jpg")}
          />
          <Text style={{ alignSelf: "center", fontWeight: "700" }}>
            bottoms
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
