import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
  Modal,
  Dimensions,
  Switch,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../services/supabase";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useUser } from "../useContext/userContext";

export default function PostProduct({ navigation }) {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageData, setImageData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [byHour, setByHour] = useState(false);
  const { user, setUser } = useUser();
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this app to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);

      const newFile = {
        uri: result.assets[0].uri,
        type: `image/${result.assets[0].uri.split(".").pop()}`,
        name: `image.${result.assets[0].uri.split(".").pop()}`,
      };

      console.log("newFile", newFile);
      setImageData(newFile);
    }
  };

  const handleXHR = async (serviceData) => {
    setModalVisible(true);

    const data = new FormData();
    data.append("file", imageData);
    data.append("upload_preset", "TizlyUpload");

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.cloudinary.com/v1_1/debru0cpu/image/upload",
      true
    );

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        handleUploadResponse(xhr, serviceData);
      } else {
        handleUploadError(xhr);
      }
    };

    xhr.onerror = () => handleUploadError(xhr);

    xhr.send(data);
  };

  const handleUploadResponse = async (xhr, serviceData) => {
    if (xhr.status === 200) {
      const resp = JSON.parse(xhr.responseText);
      const userId = supabase.auth.currentUser.id;

      const { data, error } = await supabase.from("products").insert([
        {
          userId: userId,
          productDescription: description,
          city: user.city,
          state: user.state,
          productName: title,
          productImage: resp.secure_url,
          productPrice: price,
          latitude: user.latitude,
          longitude: user.longitude,
          storeName: user.storeName,
        },
      ]);

      console.log("data", data);
      console.log("error", error);

      Alert.alert("Your Product Was Added");
      setModalVisible(false);
      setDescription("");
      setThumbnail(null);
      setPrice("");
      setTitle("");
      setImageData(null);
      setByHour(false);
      return data;
    } else {
      console.log("Upload to Cloudinary failed.");
      handleUploadFailure();
      setModalVisible(false);
    }
  };

  const handleUploadError = () => {
    console.log("An error occurred during the upload to Cloudinary.");
    handleUploadFailure();
    setModalVisible(false);
  };

  const handleUploadFailure = () => {
    Alert.alert("An error occurred during the upload");
    setModalVisible(false);
  };

  const handleClear = () => {
    setDescription("");
    setImageData(null);
    setPrice("");
    setThumbnail(null);
    setTitle("");
    setByHour(false);
  };

  const handleSubmit = async () => {
    const serviceData = {
      title,
      thumbnail,
      description,
      price,
      byHour,
    };

    if (!description || !imageData || !title || !thumbnail || !price) {
      Alert.alert("Please fill all fields.");
      return;
    }

    await handleXHR(serviceData);

    Keyboard.dismiss();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const LoadingModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <LottieView
              autoPlay
              style={{ height: 300, width: 300, alignSelf: "center" }}
              source={require("../assets/lottie/3WhiteDots.json")}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={dismissKeyboard}
          >
            <View>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter service name"
              />

              <Text style={styles.label}>Service Thumbnail</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {thumbnail ? (
                  <Image source={{ uri: thumbnail }} style={styles.image} />
                ) : (
                  <Text style={{ color: "grey" }}>Select an Image</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.label}>Product Description</Text>
              <TextInput
                style={styles.inputDescription}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your product in detail"
                multiline
              />

              <Text style={styles.label}>Product Price</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter the price of the service"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />

              <View style={{ paddingBottom: 50 }}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: "#4A3AFF",
                    width: width * 0.8,
                    height: height * 0.06,
                    padding: 12,
                    alignSelf: "center",
                    borderRadius: 13,
                    top: 20,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      alignSelf: "center",
                      fontSize: 18,
                      color: "white",
                    }}
                  >
                    Post Product
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 450 }}>
                <TouchableOpacity
                  onPress={handleClear}
                  style={{
                    backgroundColor: "black",
                    width: width * 0.8,
                    height: height * 0.06,
                    padding: 12,
                    alignSelf: "center",
                    borderRadius: 13,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      alignSelf: "center",
                      fontSize: 18,
                      color: "white",
                    }}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <LoadingModal />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#4A3AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  inputDescription: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    height: 170,
    backgroundColor: "#F3F3F9",
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F3F3F9",
    marginBottom: 12,
  },
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F3F9",
    height: 200,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4A3AFF",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
});
