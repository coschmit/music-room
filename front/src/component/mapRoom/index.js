import React from "react";
import MapView, { Circle, Marker } from "react-native-maps";

const Map = (props) => {
  const colors = ["green", "red", "blue", "pink"];

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: props.lat,
        longitude: props.long,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {props.room &&
        props.room.rooms &&
        props.room.rooms.length !== 0 &&
        props.room.rooms.map((e, key) => {
          return e.location.active === 1 ? (
            <>
              <Circle
                radius={e.location.distance * 100}
                key={key}
                fillColor={"rgba(255,212,84,0.5)"}
                center={{
                  latitude: e.location.center.lat,
                  longitude: e.location.center.long,
                }}
              />
              <Marker
                key={`${key}-marker`}
                title={e.name}
                pinColor={colors[key % 3]}
                coordinate={{
                  latitude: e.location.center.lat,
                  longitude: e.location.center.long,
                }}
              />
            </>
          ) : null;
        })}
    </MapView>
  );
};

export default Map;
