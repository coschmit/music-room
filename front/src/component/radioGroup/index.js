import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const RadioGroup = ({ options, onChange }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (value !== null) onChange(value);
  }, [value]);

  return (
    <View
      style={{
        borderColor: "#969493",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
      }}
    >
      {options.map((elem) => (
        <View key={elem} style={styles.container}>
          <Text style={styles.radioText}>{elem}</Text>
          <TouchableOpacity
            style={styles.radioCircle}
            onPress={() => {
              setValue(elem);
            }}
          >
            {value === elem && <View style={styles.selectedRb} />}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioText: {
    marginRight: 10,
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#59BC83",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#59BC83",
  },
});

export default RadioGroup;
