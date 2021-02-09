import React from "react";
import { Text, View } from "react-native";
import { Icon, Slider } from "react-native-elements";

const Player = ({
  playSong,
  previousSong,
  nextSong,
  isPlaying,
  distance,
  distanceChange,
  active,
  changeLocationType,
  changeType,
  type,
}) => {
  return (
    <View>
      <View
        style={{
          display: "flex",
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text>{Math.round(distance * 1000)} m</Text>
      </View>

      <View
        style={{
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <Slider
          minimumValue={0}
          maximumValue={1}
          value={distance}
          onValueChange={distanceChange}
          thumbStyle={{ height: 40, width: 40, backgroundColor: "transparent" }}
        />
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text
          onPress={changeLocationType}
          style={[
            active === 0 ? { color: "#59BC83" } : null,
            { marginRight: 10 },
          ]}
        >
          Location: {active === 0 ? "Not active" : "Active"}
        </Text>
        <Text onPress={changeType}>
          {type === "private" ? "Private" : "Public"}
        </Text>
      </View>
    </View>
  );
};

export default Player;
