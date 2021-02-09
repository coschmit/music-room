import React, { Component } from "react";
import { connect } from "react-redux";
import { verifyUser } from "../../actions/user.js";
import { Button, Text, TextInput, View } from "react-native";
import Toaster from "../toaster/index";

class Code extends Component {
  state = { code: "" };
  render() {
    const { code } = this.state;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          style={{ margin: 15 }}
          placeholder={"code"}
          value={this.state.code}
          onChangeText={(code) => this.setState({ code })}
        />
        {/* <Button
          onPress={() => {
            null;
          }}
        >
          Verifie
        </Button> */}
        <Text>Code</Text>
        <Button
          title="Verify"
          color="#841584"
          onPress={() => {
            this.props.dispatch(verifyUser(code, this.props.email));
          }}
        ></Button>

        {this.props.notife.message !== "" && (
          <Toaster msg={this.props.notife.message} />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notife: state.notife.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Code);
