import React, { Component } from "react";
import {
  ActionSheetIOS,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import Card from "../card";
import Test from "../test";

class ListOfRoom extends Component {
  render() {
    return (
      <ScrollView>
        <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
          {/* <Test /> */}

          {this.props.room.rooms &&
            this.props.room.rooms.length !== 0 &&
            this.props.room.rooms.map((p, key) => {
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.7}
                  style={{
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() =>
                    Actions.editRoom({
                      roomId: p._id,
                      userId: this.props.user.id,
                    })
                  }
                >
                  <Card
                    footerContent={p.name}
                    image="https://www.creativefabrica.com/wp-content/uploads/2019/02/Music-Icon-by-Kanggraphic-580x386.jpg"
                  />
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.toJS(),
    room: state.room.toJS(),
    notife: state.notife.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListOfRoom);
