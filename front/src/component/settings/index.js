import React, { Component } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Public from "./public";
import Private from "./private";
import DeezerLogin from "./deezerLogin";
class Settings extends Component {
  render() {
    return (
      <View
        style={{
          height: "80%",
          width: "100%",
        }}
      >
        <ScrollView style={{ flex: 1, flexDirection: "column", width: "100%" }}>
          <Text style={{ marginBottom: 20, marginLeft: 10 }}>
            Public Informations
          </Text>
          <Public />
          <Text style={{ marginTop: 40, marginBottom: 20, marginLeft: 10 }}>
            Private informations
          </Text>
          <Private />
          <DeezerLogin />
        </ScrollView>
      </View>
    );
  }
}

export default Settings;
