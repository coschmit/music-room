import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Card from "../card";
import Test from "../test";

const Playlist = ({ playlist, user }) => {
  const [typeOf, setTypeOf] = useState("private");
  const privateArray = [];
  const publicArray = [];

  if (playlist && playlist.playlists.length !== 0) {
    playlist.playlists.forEach((e) => {
      if (e.type === "private") {
        privateArray.push(e);
      }
      if (e.type === "public") {
        publicArray.push(e);
      }
    });
  }

  return (
    <View
      style={{
        flex: 1,
        width: "90%",
      }}
    >
      <View style={{ marginTop: "10%", width: "100%" }}>
        <View style={styles.grp_btn}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setTypeOf("private")}
            style={[
              styles.btn,
              typeOf === "private" ? { backgroundColor: "#6BE09C" } : null,
            ]}
          >
            <Text>Private</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setTypeOf("public")}
            style={[
              styles.btn,
              typeOf === "public" ? { backgroundColor: "#6BE09C" } : null,
            ]}
          >
            <Text>Public</Text>
          </TouchableOpacity>
        </View>

        {typeOf === "private" && (
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text>Your private playlist</Text>
              <Icon
                raised
                name="add"
                type="add"
                color="#f50"
                size={15}
                onPress={() => {
                  Actions.newPlaylist({ typePlaylist: "private" });
                }}
              />
            </View>

            <ScrollView
              style={{
                height: "80%",
              }}
            >
              {/* <Test /> */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {privateArray &&
                  privateArray.length !== 0 &&
                  privateArray.map((p, key) => (
                    <TouchableOpacity
                      key={key}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "50%",
                      }}
                      onPress={() => {
                        Actions.editPlaylist({
                          playlistId: p._id,
                          userId: user.id,
                        });
                      }}
                    >
                      <Card
                        styleType={1}
                        footerContent={p.name}
                        image="https://www.creativefabrica.com/wp-content/uploads/2019/02/Music-Icon-by-Kanggraphic-580x386.jpg"
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>
          </View>
        )}
        {typeOf === "public" && (
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text>{"Public playlist:"}</Text>
              <Icon
                raised
                name="add"
                type="add"
                color="#f50"
                size={15}
                onPress={() => {
                  Actions.newPlaylist({ typePlaylist: "public" });
                }}
              />
            </View>
            <ScrollView style={{ height: "80%", alignSelf: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {publicArray &&
                  publicArray.length !== 0 &&
                  publicArray.map((p, key) => {
                    return (
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: "50%",
                        }}
                        key={key}
                        onPress={() => {
                          Actions.editPlaylist({
                            playlistId: p._id,
                            userId: user.id,
                          });
                        }}
                      >
                        <Card
                          styleType={1}
                          footerContent={p.name}
                          image="https://www.creativefabrica.com/wp-content/uploads/2019/02/Music-Icon-by-Kanggraphic-580x386.jpg"
                        />
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grp_btn: {
    flexDirection: "row",
    justifyContent: "center",
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

export default Playlist;
