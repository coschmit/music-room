import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connectDeezer, disconnectDeezer } from "../../utils/deezerService";
import * as SecureStore from "expo-secure-store";
import { Actions } from "react-native-router-flux";

const DeezerLogin = () => {
  return (
    <View
      style={{
        marginTop: 40,
        width: "80%",
        alignSelf: "center",
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.btn, { backgroundColor: "#554F55" }]}
        onPress={() => {
          Actions.friend();
        }}
      >
        <Text style={styles.txt}>Friends</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.btn, { backgroundColor: "#3B373B" }]}
        onPress={() => {
          connectDeezer().then((res) => console.log("res deezer login", res));
        }}
      >
        <Text style={styles.txt}>Deezer Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.btn, { backgroundColor: "#322F32" }]}
        onPress={() => {
          disconnectDeezer().then((res) => console.log("res logout", res));
        }}
      >
        <Text style={styles.txt}>Deezer LogOut</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.btn, { backgroundColor: "#2A282A" }]}
        onPress={() => {
          SecureStore.deleteItemAsync("token", {}).then(() => {
            Actions.login();
          });
        }}
      >
        <Text style={styles.txt}>LogOut</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    marginVertical: 5,
    backgroundColor: "#2A282A",
    paddingVertical: 15,
  },
  txt: { textAlign: "center", color: "white" },
});

export default DeezerLogin;
