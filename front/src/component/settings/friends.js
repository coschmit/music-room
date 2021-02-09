import React, { Component } from "react";
import { ScrollView, Text, Button, View } from "react-native";
import { Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { TextField } from "react-native-ui-lib";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { addFriend } from "../../actions/user";
import Toaster from "../toaster";

class Friends extends Component {
  state = {};

  renderTextField = ({ input, label, secureTextEntry }) => (
    <View style={{ flexDirection: "row" }}>
      <TextField
        color="black"
        style={{ width: 300 }}
        placeholder={label}
        {...input}
        secureTextEntry={secureTextEntry}
      />
      <Icon
        color="#59BC83"
        onPress={this.props.handleSubmit(this.onSubmit)}
        name="user-plus"
        style={{ marginLeft: 10 }}
        type="font-awesome-5"
      />
    </View>
  );

  onSubmit = (event) => {
    this.props.dispatch(
      addFriend(event.email.toLowerCase(), this.props.user.id)
    );
  };

  render() {
    const { user } = this.props;

    return (
      <View style={{ width: "80%", alignSelf: "center", marginTop: 40 }}>
        <Field
          label={"Email"}
          name={"email"}
          component={this.renderTextField}
        />

        <ScrollView>
          {!!user &&
            user.friends.length !== 0 &&
            user.friends.map((u, key) => {
              return (
                <View
                  key={key}
                  style={{
                    // borderWidth: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{u}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Icon
                      raised
                      name="delete"
                      type="delete"
                      color="#59BC83"
                      // onPress={() => { this.props.dispatch(deleteFriend(u, user.id)) }}
                    />
                    <Icon
                      raised
                      name="visibility"
                      type="visibility"
                      color="#59BC83"
                      onPress={() => {
                        Actions.showProfile({ email: u, myEmail: user.email });
                      }}
                    />
                  </View>
                </View>
              );
            })}
        </ScrollView>
        {this.props.notife.message !== "" && (
          <Toaster msg={this.props.notife.message} />
        )}
      </View>
    );
  }
}

const validate = (values) => {
  const errors = {};
  const requiredFields = ["email"];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  return errors;
};

Friends = reduxForm({
  form: "addFriendForm",
  validate,
})(Friends);

const mapStateToProps = (state) => {
  return {
    user: state.user.toJS(),
    notife: state.notife.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
