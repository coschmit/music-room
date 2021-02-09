import React, { Component } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { TextField } from "react-native-ui-lib";
import { connect } from "react-redux";
import request from "superagent";
import { addPlaylistSong, updatePlaylist } from "../../actions/playlist";
import Card from "../card";
import {
  pause,
  play,
  playTrack,
  isPlayingDeezer,
} from "../../utils/deezerService";
import Player from "../Player";
import Toaster from "../toaster";
import AddUser from "./addUser";
import { updateClassement } from "../../actions/classement";

let interval = null;

class Playlist extends Component {
  state = {
    typeOf: "play",
    info: [],
    isPlaying: false,
    value: "",
    currentSong: "",
    duration: 0,
    next: 0,
  };

  componentWillMount() {
    this.afterSong();
  }

  componentWillUnmount() {
    clearInterval(interval);
    pause();
  }

  afterSong = () => {
    interval = setInterval(() => {
      this.incrementation();
    }, 1000);
  };

  pushToClassement = (id) => {
    const songs = this.props.classement.songs;
    const index1 = this.props.playlist.playlists.findIndex(
      (e) => e._id === this.props.playlistId
    );
    const songPlaylist = this.props.playlist.playlists[index1].songs.findIndex(
      (s) => s.id === id
    );
    const song = this.props.playlist.playlists[index1].songs[songPlaylist];
    const idSong = songs.findIndex((s) => s.id === id);
    // pour chaque musique nous avons une liste d'user qui ont voté pour cette musique
    // si l'user a deja vote pour cette musique alors il ne peut pas revoter, sinon on l'ajoute a la liste et +1 vote de la chanson
    if (idSong > -1) {
      const idUser = songs[idSong].users.findIndex(
        (u) => u === this.props.user.id
      );
      if (idUser === -1) {
        songs[idSong].users.push(this.props.user.id);
        songs[idSong].vote++;
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

  incrementation = () => {
    const { duration, next, currentSong, isPlaying } = this.state;
    isPlayingDeezer((tmpPlayer) => {
      if (isPlaying) {
        this.setState({ next: next + 1 });
        if (next === duration) {
          callApi(`playlist/all/${this.props.userId}/`, "get").then((body) => {
            const index1 = body.playlists.findIndex(
              (e) => e._id === this.props.playlistId
            );
            const songs = body.playlists[index1].songs;
            let index = songs.findIndex((e) => e.id === currentSong);
            index += 1;
            if (index >= songs.length) {
              index = 0;
            }
            this.playTrackWrapper(songs[index].id);
          });
        }
        if ((next === 30 || next === 31) && !tmpPlayer) {
          callApi(`playlist/all/${this.props.userId}/`, "get").then((body) => {
            const index1 = body.playlists.findIndex(
              (e) => e._id === this.props.playlistId
            );
            const songs = body.playlists[index1].songs;
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

  updateGrade = (grade, songId) => {
    const { playlist, dispatch, user } = this.props;
    const index1 = playlist.playlists.findIndex(
      (e) => e._id === this.props.playlistId
    );

    const songs = playlist.playlists[index1].songs;
    const index = songs.findIndex((e) => e.id === songId);

    if (grade > 0) {
      const toGo = songs[index - 1].grade;
      const at = songs[index].grade;
      songs[index].grade = toGo;
      songs[index - 1].grade = at;
    } else {
      const toGo = songs[index + 1].grade;
      const at = songs[index].grade;
      songs[index].grade = toGo;
      songs[index + 1].grade = at;
    }

    dispatch(
      updatePlaylist({ songs }, playlist.playlists[index1]._id, user.id)
    );
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
    const { isPlaying, currentSong } = this.state;
    const { playlist } = this.props;
    if (!currentSong) {
      const index1 = playlist.playlists.findIndex(
        (e) => e._id === this.props.playlistId
      );
      const song = playlist.playlists[index1].songs[0];
      if (
        playlist.playlists[index1] &&
        playlist.playlists[index1].songs &&
        playlist.playlists[index1].songs[0]
      ) {
        this.playTrackWrapper(song.id);
      }
    } else if (!isPlaying) {
      this.setState({ isPlaying: !isPlaying });
      play();
    } else {
      this.setState({ isPlaying: !isPlaying });
      pause();
    }
  };

  previousSong = () => {
    const { currentSong } = this.state;
    const { playlist } = this.props;
    const index1 = playlist.playlists.findIndex(
      (e) => e._id === this.props.playlistId
    );

    const songs = playlist.playlists[index1].songs;
    let index = songs.findIndex((e) => e.id === currentSong);

    index -= 1;
    if (index < 0) {
      index = 0;
    }
    if (
      playlist.playlists[index1] &&
      playlist.playlists[index1].songs &&
      playlist.playlists[index1].songs[0]
    ) {
      this.playTrackWrapper(songs[index].id);
    }
  };

  nextSong = () => {
    const { currentSong } = this.state;
    const { playlist } = this.props;

    const index1 = playlist.playlists.findIndex(
      (e) => e._id === this.props.playlistId
    );
    const songs = playlist.playlists[index1].songs;

    let index = songs.findIndex((e) => e.id === currentSong);
    index += 1;
    if (index >= songs.length) {
      index = 0;
    }
    if (
      playlist.playlists[index1] &&
      playlist.playlists[index1].songs &&
      playlist.playlists[index1].songs[0]
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

  render() {
    const { typeOf, info } = this.state;
    const { playlist, user } = this.props;
    const index = playlist.playlists.findIndex(
      (e) => e._id === this.props.playlistId
    );
    const indexUser = playlist.playlists[index].users.findIndex(
      (u) => u.id === user.id
    );
    let superU = false;
    if (playlist.playlists[index].users[0].email === user.email) {
      superU = true;
    }

    return (
      <View style={{ flex: 1 }}>
        {index !== -1 &&
          indexUser !== -1 &&
          playlist.playlists !== null &&
          playlist.playlists[index].users !== null &&
          playlist.playlists[index].users[indexUser].role === "RW" && (
            <View style={styles.grp_btn}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  typeOf === "play" ? { backgroundColor: "#6BE09C" } : null,
                ]}
                onPress={() => this.setState({ typeOf: "play" })}
              >
                <Text>Play</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  typeOf === "add" ? { backgroundColor: "#6BE09C" } : null,
                ]}
                onPress={() => this.setState({ typeOf: "add" })}
              >
                <Text>Add Song</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  typeOf === "addUser" ? { backgroundColor: "#6BE09C" } : null,
                ]}
                onPress={() => this.setState({ typeOf: "addUser" })}
              >
                <Text>Add An User</Text>
              </TouchableOpacity>
            </View>
          )}
        {typeOf === "play" && (
          <View style={{ flex: 1 }}>
            <ScrollView style={{ height: "80%" }}>
              {!!playlist &&
                !!playlist.playlists &&
                playlist.playlists[index].songs !== 0 &&
                playlist.playlists[index].songs.map((s, key) => {
                  return (
                    <View
                      key={key}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 15,
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        style={{ width: "50%" }}
                        onPress={() => {
                          this.playTrackWrapper(s.id);
                        }}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                          {s.name}
                        </Text>
                      </TouchableOpacity>

                      <View style={{ flexDirection: "row" }}>
                        {index !== -1 &&
                          indexUser !== -1 &&
                          playlist.playlists !== null &&
                          playlist.playlists[index].users !== null &&
                          playlist.playlists[index].users[indexUser].role ===
                            "RW" && (
                            <>
                              <Icon
                                raised
                                name="keyboard-arrow-up"
                                type="keyboard-arrow-up"
                                color="#59BC83"
                                size={18}
                                onPress={() => {
                                  if (key !== 0) {
                                    this.updateGrade(1, s.id);
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
                                  if (
                                    key <
                                    playlist.playlists[index].songs.length - 1
                                  ) {
                                    this.updateGrade(-1, s.id);
                                  }
                                }}
                              />
                            </>
                          )}
                        <Icon
                          raised
                          name="star"
                          type="star"
                          color="#23242d"
                          size={15}
                          onPress={() => {
                            this.pushToClassement(s.id);
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
            <Player
              previousSong={this.previousSong}
              nextSong={this.nextSong}
              isPlaying={this.state.isPlaying}
              playSong={() => {
                this.pausePlay();
              }}
            />
          </View>
        )}

        {typeOf === "add" && (
          <View>
            <TextField
              placeholder="Find a song"
              value={this.state.value}
              onChangeText={(value) => this.callDeezerApi(value)}
            />
            <ScrollView>
              {!!info &&
                info.length !== 0 &&
                info.map((e, key) => {
                  return (
                    <View
                      key={key}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Card footerContent={e.title} image={e.album.cover_big} />
                      <Button
                        onPress={() => {
                          this.props.dispatch(
                            addPlaylistSong(
                              e.id,
                              this.props.playlistId,
                              this.props.userId,
                              e.title
                            )
                          );
                        }}
                        title="Add Song"
                      />
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        )}

        {typeOf === "addUser" && superU === true && (
          <AddUser
            plId={this.props.playlistId}
            userId={user.id}
            users={playlist.playlists[index].users}
          />
        )}
        {typeOf === "addUser" && superU !== true && (
          <Text style={{ textAlign: "center" }}>
            your not allowed to add users
          </Text>
        )}

        {this.props.notife.message !== "" && (
          <Toaster msg={this.props.notife.message} />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist.toJS(),
    user: state.user.toJS(),
    notife: state.notife.toJS(),
    classement: state.classement.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

const styles = StyleSheet.create({
  grp_btn: {
    justifyContent: "center",
    flexDirection: "row",
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 6,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 5,
    backgroundColor: "#CDCDCF",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
