import React, { Component } from "react";
import { Button, Text, View } from "react-native";
import { TextField } from "react-native-ui-lib";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { createRoom } from "../../actions/room";
import Toaster from "../toaster";
class NewRoom extends Component {
  renderTextField = ({ input, label, secureTextEntry }) => (
    <TextField
      color="white"
      placeholder={label}
      {...input}
      secureTextEntry={secureTextEntry}
    />
  );

  onSubmit = (event) => {
    event.users = [];
    event.users.push({
      id: this.props.user.id,
      role: "RW",
      email: this.props.user.email,
      super: true,
    });
    event.type = "public";
    this.props.dispatch(createRoom(event));
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: "#1e1438",
        }}
      >
        <Text>New track</Text>
        <Field label="Name" name="name" component={this.renderTextField} />
        <Field
          label={"Description"}
          name={"description"}
          component={this.renderTextField}
        />
        <Button
          title="Create"
          onPress={this.props.handleSubmit(this.onSubmit)}
        />
        {this.props.notife.message !== "" && (
          <Toaster msg={this.props.notife.message} />
        )}
      </View>
    );
  }
}

const validate = (values) => {
  const errors = {};
  const requiredFields = ["name", "description", "type"];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  return errors;
};

NewRoom = reduxForm({
  form: "signupForm",
  validate,
})(NewRoom);

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

export default connect(mapStateToProps, mapDispatchToProps)(NewRoom);
