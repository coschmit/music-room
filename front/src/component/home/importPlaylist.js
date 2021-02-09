import React, { Component } from "react";
import { Button, Text, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { connect } from "react-redux";
import { getPlaylists } from "../../utils/deezerService";
import { importDeezerList } from "../../actions/playlist";

class ImportPlaylist extends Component {
  state = {
    playlistDeezer: [],
    listToImport: [],
  };

  UNSAFE_componentWillMount() {
    console.log("before getPlaylists");
    getPlaylists().then((playlistDeezer) => {
      console.log("getPlaylist done");
      const tmp = [];
      playlistDeezer.forEach((e) => {
        e.is = false;
        tmp.push(e);
      });

      this.setState({ playlistDeezer });
    });
  }

  render() {
    const { playlistDeezer, listToImport } = this.state;
    return (
      <View>
        {!!playlistDeezer &&
          playlistDeezer.length !== 0 &&
          playlistDeezer.map((e, key) => {
            return (
              <View
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <CheckBox
                  onPress={() => {
                    const index = listToImport.findIndex(
                      (obj) => obj.title === e.title
                    );
                    if (index === -1) {
                      playlistDeezer[key].is = true;
                      listToImport.push(e);
                    } else {
                      playlistDeezer[key].is = false;

                      listToImport.splice(index, 1);
                    }
                    this.setState({ listToImport });
                  }}
                  checked={e.is}
                />
                <Text>{e.title}</Text>
              </View>
            );
          })}
        <Button
          onPress={() => {
            this.props.dispatch(
              importDeezerList(this.props.user.id, listToImport)
            );
          }}
          title="Import"
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(ImportPlaylist);
