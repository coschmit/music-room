import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";

const Player = ({ playSong, previousSong, nextSong, isPlaying }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Icon
        raised
        name="skip-previous"
        type="skip-previous"
        color="#59BC83"
        onPress={previousSong}
      />
      <Icon
        raised
        name={!isPlaying ? "play-arrow" : "pause"}
        type={!isPlaying ? "play-arrow" : "pause"}
        color="#59BC83"
        onPress={playSong}
      />
      <Icon
        raised
        name="skip-next"
        type="skip-next"
        color="#59BC83"
        onPress={nextSong}
      />
    </View>
  );
};

export default Player;
