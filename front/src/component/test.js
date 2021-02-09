import React from "react";
import { View, Text } from "react-native";

const Test = () => {
  const getRandomColor = () => {
    return (
      "rgb(" +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      ")"
    );
  };

  const index = 12;

  const rows = [];
  for (let i = 0; i < index; i++) {
    rows.push(
      <View
        style={{
          flexWrap: "wrap",
          width: 50,
          height: 50,
          backgroundColor: getRandomColor(),
        }}
      />
    );
  }
  return (
    <View
      style={{
        flexWrap: "wrap",

        flex: 1,
        height: 500,
        width: "100%",
        borderWidth: 10,
        borderColor: "blue",
        flexDirection: "row",
      }}
    >
      {rows}
    </View>
  );
};

export default Test;
