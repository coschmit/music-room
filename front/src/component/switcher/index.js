import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

const Switcher = ({ setTypeOf, typeOf }) => {
  return (
    <View style={styles.grp_btn}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setTypeOf("play")}
        style={[
          styles.btn,
          typeOf === "play" ? { backgroundColor: "#6BE09C" } : null,
        ]}
      >
        <Text>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setTypeOf("add")}
        style={[
          styles.btn,
          typeOf === "add" ? { backgroundColor: "#6BE09C" } : null,
        ]}
      >
        <Text>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setTypeOf("addUser")}
        style={[
          styles.btn,
          typeOf === "addUser" ? { backgroundColor: "#6BE09C" } : null,
        ]}
      >
        <Text>Add an user</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  grp_btn: {
    flexDirection: "row",
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 6,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 5,
    backgroundColor: "#CDCDCF",
  },
});

export default Switcher;
