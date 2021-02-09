import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import Switcher from "../switcher";
import { Button, Icon, Input } from "react-native-elements";
import Player from "../Player/specialPlayer";
import { addRoomSong, updateRoom } from "../../actions/room";
import Toaster from "../toaster/index";
import Card from "../card/index";
import request from "superagent";
import {
  pause,
  play,
  playTrack,
  isPlayingDeezer,
} from "../../utils/deezerService";
import AddUser from "./addRoomUser";
import * as Location from "expo-location";
import { updateClassement } from "../../actions/classement";

let interval = null;

class Room extends Component {
  state = {
    typeOf: "play",
    isPlaying: false,
    currentSong: "",
    value: "",
    info: [],
    duration: 0,
  };

  componentWillUnmount() {
    clearInterval(interval);
    pause();
  }

  componentDidMount() {
    const { room } = this.props;
    const index = room.rooms.findIndex((e) => e._id === this.props.roomId);
    if (
      room.rooms &&
      index !== -1 &&
      room.rooms[index].songs &&
      room.rooms[index].songs[0]
    ) {
      this.playTrackWrapper(room.rooms[index].songs[0].id);
    }
    this.afterSong();
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.props.dispatch({
        type: "client/addNotife",
        message:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!",
      });
    }
  }

  afterSong = () => {
    interval = setInterval(() => {
      this.incrementation();
    }, 1000);
  };

  incrementation = () => {
    const { duration, next, currentSong, isPlaying } = this.state;

    isPlayingDeezer((tmpPlayer) => {
      if (isPlaying) {
        this.setState({ next: next + 1 });
        if (next === duration) {
          callApi(
            `room/all/${this.props.userId}/${this.props.user.lat}/${this.props.user.long}`,
            "get"
          ).then((body) => {
            const index1 = body.rooms.findIndex(
              (e) => e._id === this.props.roomId
            );
            const songs = body.rooms[index1].songs;
            let index = songs.findIndex((e) => e.id === currentSong);
            index += 1;
            if (index >= songs.length) {
              index = 0;
            }
            this.playTrackWrapper(songs[index].id);
          });
        }
        if ((next === 30 || next === 31) && !tmpPlayer) {
          callApi(
            `room/all/${this.props.userId}/${this.props.user.lat}/${this.props.user.long}`,
            "get"
          ).then((body) => {
            const index1 = body.rooms.findIndex(
              (e) => e._id === this.props.roomId
            );
            const songs = body.rooms[index1].songs;
            let index = songs.findIndex((e) => e.id === currentSong);
            index += 1;
            if (index >= songs.length) {
              index = 0;
            }
            this.playTrackWrapper(songs[index].id);
          });
        }
      }
    });
  };

  changeType = () => {
    const { room, dispatch, user } = this.props;
    const index1 = room.rooms.findIndex((e) => e._id === this.props.roomId);
    const indexUser = room.rooms[index1].users.findIndex(
      (u) => u.id === user.id
    );

    if (indexUser === 0) {
      room.rooms[index1].type =
        room.rooms[index1].type === "private" ? "public" : "private";
      dispatch(updateRoom(room.rooms[index1], room.rooms[index1]._id, user.id));
    } else {
      this.props.dispatch({
        type: "client/addNotife",
        message:
          "you're not the creator of this room so you cannot make this action",
      });
    }
  };
  changeLocationType = async () => {
    const { room, dispatch, user } = this.props;
    const index1 = room.rooms.findIndex((e) => e._id === this.props.roomId);
    const indexUser = room.rooms[index1].users.findIndex(
      (u) => u.id === user.id
    );

    if (indexUser === 0) {
      room.rooms[index1].location.active ^= 1;
      if (room.rooms[index1].location.active === 1) {
        const { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          this.props.dispatch({
            type: "client/addNotife",
            message: "Permission to access location was denied",
          });
        }
        const position = await Location.getCurrentPositionAsync({});
        room.rooms[index1].location.center = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };
        dispatch(
          updateRoom(room.rooms[index1], room.rooms[index1]._id, user.id)
        );
      } else {
        dispatch(
          updateRoom(room.rooms[index1], room.rooms[index1]._id, user.id)
        );
      }
    } else {
      this.props.dispatch({
        type: "client/addNotife",
        message:
          "you're not the creator of this room so you cannot make this action.",
      });
    }
  };

  playTrackWrapper = (id) => {
    const { isPlaying } = this.state;
    if (isPlaying) {
      playTrack(id.toString()).then(() => {
        playTrack(id.toString()).then(() => {
          this.setState({ isPlaying: true, currentSong: id });
        });
      });
    } else {
      playTrack(id.toString()).then(() => {
        this.setState({ isPlaying: true, currentSong: id });
      });
    }
    request
      .get(`https://api.deezer.com/track/${id}`)
      .set("Accept", "application/json")
      .then((res) => {
        this.setState({ duration: res.body.duration });
      });
  };

  callDeezerApi = (value) => {
    this.setState({ value });
    request
      .get(`https://api.deezer.com/search?q=${value}`)
      .set("Accept", "application/json")
      .then((res) => {
        this.setState({ info: res.body.data });
      });
  };

  pausePlay = () => {
    const { room } = this.props;
    if (!this.state.currentSong) {
      const index1 = room.rooms.findIndex((e) => e._id === this.props.roomId);
      const song = room.rooms[index1].songs[0];
      if (
        room.rooms[index1] &&
        room.rooms[index1].songs &&
        room.rooms[index1].songs[0]
      ) {
        this.playTrackWrapper(song.id);
      }
    } else if (!this.state.isPlaying) {
      this.setState({ isPlaying: !this.state.isPlaying });
      play();
    } else {
      this.setState({ isPlaying: !this.state.isPlaying });
      pause();
    }
  };

  previousSong = () => {
    const { currentSong } = this.state;
    const { room } = this.props;
    const index1 = room.rooms.findIndex((e) => e._id === this.props.roomId);

    const songs = room.rooms[index1].songs;
    let index = songs.findIndex((e) => e.id === currentSong);

    index -= 1;
    if (index < 0) {
      index = 0;
    }
    if (
      room.rooms[index1] &&
      room.rooms[index1].songs &&
      room.rooms[index1].songs[0]
    ) {
      this.playTrackWrapper(songs[index].id);
    }
  };

  nextSong = () => {
    const { currentSong } = this.state;
    const { room } = this.props;
    const index1 = room.rooms.findIndex((e) => e._id === this.props.roomId);

    const songs = room.rooms[index1].songs;
    let index = songs.findIndex((e) => e.id === currentSong);

    index += 1;
    if (index >= songs.length) {
      index = 0;
    }
    if (
      room.rooms[index1] &&
      room.rooms[index1].songs &&
      room.rooms[index1].songs[0]
    ) {
      this.playTrackWrapper(songs[index].id);
    }
  };

  playTrackWrapper = (id) => {
    const { isPlaying } = this.state;
    if (isPlaying) {
      playTrack(id.toString()).then(() => {
        playTrack(id.toString()).then(() => {
          this.setState({ isPlaying: true, currentSong: id });
        });
      });
    } else {
      playTrack(id.toString()).then(() => {
        this.setState({ isPlaying: true, currentSong: id });
      });
    }
    request
      .get(`https://api.deezer.com/track/${id}`)
      .set("Accept", "application/json")
      .then((res) => {
        this.setState({ duration: res.body.duration });
      });
  };

  distanceChange = (distance) => {
    const { room, dispatch, user } = this.props;
    const index1 = room.rooms.findIndex((e) => e._id === this.props.roomId);
    const indexUser = room.rooms[index1].users.findIndex(
      (u) => u.id === user.id
    );

    if (indexUser === 0) {
      room.rooms[index1].location.distance = distance;
      dispatch(updateRoom(room.rooms[index1], room.rooms[index1]._id, user.id));
    } else {
      dispatch({
        type: "client/addNotife",
        message:
          "you're not the creator of this room so you cannot make this action.",
      });
    }
  };

  updateVote = (vote, songId) => {
    const { room, dispatch, user } = this.props;
    const index1 = room.rooms.findIndex((e) => e._id === this.props.roomId);

    const songs = room.rooms[index1].songs;
    const index = songs.findIndex((e) => e.id === songId);

    songs[index].vote += vote > 0 ? -1 : 1;
    dispatch(updateRoom({ songs }, room.rooms[index1]._id, user.id));
  };

  pushToClassement = (id) => {
    let songs = this.props.classement.songs;
    if (songs === undefined) songs = [];
    const index1 = this.props.room.rooms.findIndex(
      (s) => s._id === this.props.roomId
    );

    const songRoom = this.props.room.rooms[index1].songs.findIndex(
      (s) => s.id === id
    );

    const song = this.props.room.rooms[index1].songs[songRoom];
    let idSong = songs !== undefined ? songs.findIndex((s) => s.id === id) : -2;
    if (idSong > -1) {
      const idUser = songs[idSong].users.findIndex(
        (u) => u === this.props.user.id
      );
      if (idUser === -1) {
        songs[idSong].users.push(this.props.user.id);
        song[idSong].vote++;
        this.props.dispatch(updateClassement(songs));
      }
    } else {
      song.users = [];
      song.users.push(this.props.user.id);
      song.vote = 1;
      songs.push(song);
      this.props.dispatch(updateClassement(songs));
    }
  };

  render() {
    const { typeOf, info } = this.state;
    const { room, user } = this.props;
    const index = room.rooms.findIndex((e) => e._id === this.props.roomId);
    let superU = false;
    if (room.rooms[index].users[0].email === user.email) {
      superU = true;
    }
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Switcher
          setTypeOf={(typeOf) => this.setState({ typeOf })}
          typeOf={typeOf}
        />
        {typeOf === "play" && (
          <View style={{ flex: 1 }}>
            <ScrollView style={{ height: "60%" }}>
              {!!room &&
                !!room.rooms &&
                room.rooms[index].songs !== 0 &&
                room.rooms[index].songs.map((s, key) => {
                  return (
                    <View
                      key={key}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderBottomColor: "#A4A4A5",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          marginRight: 10,
                        }}
                        onPress={() => {
                          this.playTrackWrapper(s.id);
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                          {s.name}
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text>Vote {-s.vote}</Text>
                        <Icon
                          raised
                          name="keyboard-arrow-up"
                          type="keyboard-arrow-up"
                          color="#59BC83"
                          size={18}
                          onPress={() => {
                            if (key !== 0) {
                              this.updateVote(1, s.id);
                            }
                          }}
                        />

                        <Icon
                          raised
                          name="keyboard-arrow-down"
                          type="keyboard-arrow-down"
                          color="#59BC83"
                          size={18}
                          onPress={() => {
                            if (key < room.rooms[index].songs.length - 1) {
                              this.updateVote(-1, s.id);
                            }
                          }}
                        />

                        <Icon
                          raised
                          name="star"
                          type="star"
                          color="#23242d"
                          size={15}
                          onPress={() => this.pushToClassement(s.id)}
                        />
                      </View>
                    </View>
                  );
                })}
            </ScrollView>

            <Player
              playSong={this.pausePlay}
              previousSong={this.previousSong}
              nextSong={this.nextSong}
              isPlaying={this.state.isPlaying}
              distanceChange={this.distanceChange}
              distance={room.rooms[index].location.distance}
              active={room.rooms[index].location.active}
              type={room.rooms[index].type}
              changeType={this.changeType}
              changeLocationType={this.changeLocationType}
            />
          </View>
        )}

        {typeOf === "add" && (
          <View
            style={{
              flex: 1,
              width: "100%",
            }}
          >
            <Input
              placeholder="Find a song"
              value={this.state.value}
              onChangeText={(value) => this.callDeezerApi(value)}
            />

            <ScrollView>
              <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                {!!info &&
                  info.length !== 0 &&
                  info.map((e, key) => {
                    return (
                      <View
                        key={key}
                        style={{
                          width: "50%",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <Card
                          footerContent={e.title}
                          image={e.album.cover_big}
                        />
                        <Button
                          title="Add Song"
                          type="outline"
                          buttonStyle={{
                            borderColor: "#59BC83",
                            borderWidth: 2,
                          }}
                          titleStyle={{ color: "#59BC83" }}
                          onPress={() => {
                            if (
                              !room.rooms[index].songs.some(
                                (elem) => elem.id === e.id.toString()
                              )
                            ) {
                              this.props.dispatch(
                                addRoomSong(
                                  e.id,
                                  this.props.roomId,
                                  this.props.userId,
                                  e.title
                                )
                              );
                            }
                          }}
                        />
                      </View>
                    );
                  })}
              </View>
            </ScrollView>
          </View>
        )}

        {typeOf === "addUser" && superU === true && (
          <AddUser
            plId={this.props.roomId}
            userId={user.id}
            users={room.rooms[index].users}
          />
        )}

        {typeOf === "addUser" && superU !== true && (
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: "center" }}>
              your not allowed to add users
            </Text>
          </View>
        )}
        {this.props.notife.message !== "" && (
          <Toaster msg={this.props.notife.message} />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    room: state.room.toJS(),
    user: state.user.toJS(),
    notife: state.notife.toJS(),
    classement: state.classement.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
