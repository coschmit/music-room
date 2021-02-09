import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import ListOfRoom from "./listofroom";
import { Actions } from "react-native-router-flux";
import * as Location from "expo-location";

class MusicTrack extends Component {
  render() {
    return (
      <View style={{ flex: 1, width: "90%" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "25%",
            padding: 10,
          }}
        >
          <Icon
            raised
            name="map"
            type="map"
            color="#23242d"
            size={25}
            onPress={() =>
              Location.requestPermissionsAsync().then((status) => {
                if (status.status === "granted") {
                  Location.getCurrentPositionAsync({}).then((position) => {
                    Actions.map({
                      room: this.props.room,
                      lat: position.coords.latitude,
                      long: position.coords.longitude,
                    });
                  });
                }
              })
            }
          />
          <Button title="Add new trackList" onPress={() => Actions.newRoom()} />
          <Icon
            raised
            name="star"
            type="star"
            color="#23242d"
            size={25}
            onPress={() => Actions.classement()}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            height: "70%",
            flexWrap: "wrap",
          }}
        >
          <ListOfRoom />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.toJS(),
    room: state.room.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicTrack);
