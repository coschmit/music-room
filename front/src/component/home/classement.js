import React, { Component } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import { updateClassement } from "../../actions/classement";

class Classement extends Component {
  pushToClassement = (id) => {
    const songs = this.props.classement.songs;
    const use = songs[id].users.findIndex((u) => u === this.props.user.id);
    if (use === -1) {
      songs[id].users.push(this.props.user.id);
      songs[id].vote++;
      this.props.dispatch(updateClassement(songs));
    } else {
      this.props.dispatch({
        type: "client/addNotife",
        data: "You've already voted for him.",
      });
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ height: "60%" }}
          data={this.props.classement.songs}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                raised
                name="keyboard-arrow-up"
                type="keyboard-arrow-up"
                color="#f50"
                size={15}
                onPress={() => {
                  this.pushToClassement(index);
                }}
              />
              <Text>Vote {item.vote}</Text>
              <Button
                title={item.name}
                style={{
                  backgroundColor: `rgb(${Math.floor(
                    Math.random() * 255
                  )},${Math.floor(Math.random() * 255)},${Math.floor(
                    Math.random() * 255
                  )})`,
                }}
              />
            </View>
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    classement: state.classement.toJS(),
    user: state.user.toJS(),
    notife: state.notife.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Classement);
