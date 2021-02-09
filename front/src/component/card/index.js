import React from "react";
import { Image, Text, View } from "react-native";

const Card = ({ footerContent, image, styleType }) => {
  return (
    <View
      style={
        styleType === 1
          ? {
              margin: 10,
              width: 150,
              height: 150,
              borderWidth: 2,
              borderRadius: 15,
              borderColor: "#2A282A",
            }
          : {
              margin: 10,
              width: 150,
              height: 150,
              borderWidth: 4,
              borderRadius: 5,
              borderColor: "#6BE09C",
            }
      }
    >
      <View style={{ flex: 4 }}>
        <Image
          style={{
            resizeMode: "contain",
            height: "100%",
            margin: 10,
            borderBottomWidth: styleType === 1 ? 1 : 0,
          }}
          source={{ uri: image }}
        />
      </View>

      <View
        style={{
          flex: 1,
          margin: 10,
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text numberOfLines={1}>{footerContent}</Text>
      </View>
    </View>
  );
};

export default Card;
