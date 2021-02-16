import React, { Component } from "react";
import { Button, Text, View, Platform } from "react-native";
import { connect } from "react-redux";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import Menu from "./menu";
import Toaster from "../toaster/index";
import MusicTrack from "./musicTrack";
import Playlist from "./playlist";
import Settings from "../settings";
import { getRoom } from "../../actions/room";
import { createClassement, getClassement } from "../../actions/classement";
import { getPlaylist } from "../../actions/playlist";
import { checkSession } from "../../utils/deezerService";
import { Actions } from "react-native-router-flux";
import DeviceInfo from "react-native-device-info";

class Home extends Component {
  state = {
    mode: this.props.mode || 0,
    disab: true,
  };

  async UNSAFE_componentWillMount() {
    const { dispatch } = this.props;

    //  Device info but in front

    // console.log(
    //   "Device Info",
    //   "\nbrand: ",
    //   DeviceInfo.getBrand(),
    //   "\nmodel: ",
    //   DeviceInfo.getModel()
    // );
    // DeviceInfo.getCarrier().then((res) => console.log("carrier: ", res));
    // DeviceInfo.getDeviceName().then((res) => console.log("devicename: ", res));
    // console.log("Platform", Platform.Version);
    // console.log("platform version", Platform.Version);
    dispatch(createClassement(null));
    dispatch(getClassement());

    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      dispatch(getRoom({ userId: this.props.user.id }));
    } else {
      Location.getCurrentPositionAsync({})
        .then((position) => {
          dispatch(
            getRoom({
              userId: this.props.user.id,
              lat: position.coords.latitude,
              long: position.coords.longitude,
            })
          );
        })
        .catch((err) => console.log("err position", err));
    }
  }

  componentWillReceiveProps() {
    checkSession((e) => {
      if (e === false) {
        this.setState({ mode: 2 });
      }
      this.setState({ disab: e });
    });
  }

  serviceMode = async () => {
    this.setState({ mode: 0 });
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      this.props.dispatch(getRoom({ userId: this.props.userId }));
    } else {
      Location.getCurrentPositionAsync({}).then((position) => {
        this.props.dispatch(
          getRoom({
            userId: this.props.user.id,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          })
        );
      });
    }
  };

  playlistMode = () => {
    this.setState({ mode: 1 });
    this.props.dispatch(getPlaylist(this.props.user.id));
  };
  settingsMode = () => {
    this.setState({ mode: 2 });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {this.state.mode === 0 && this.state.disab && (
          <MusicTrack user={this.props.user} />
        )}
        {this.state.mode === 1 && this.state.disab && (
          <Playlist playlist={this.props.playlist} user={this.props.user} />
        )}
        {this.state.mode === 2 && <Settings />}
        <Menu
          serviceMode={this.serviceMode}
          playlistMode={this.playlistMode}
          settingsMode={this.settingsMode}
        />

        {this.props.notife.message !== "" && (
          /* <View style={{ position: "absolute", bottom: 100 }}>
              <Button
                onPress={() => {
                  SecureStore.deleteItemAsync("token", {}).then(() => {
                    Actions.login();
                  });
                }}
                title="disconnect"
              />
            </View> */

          <Toaster msg={this.props.notife.message} />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.toJS(),
    playlist: state.playlist.toJS(),
    notife: state.notife.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

// export default Home;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
