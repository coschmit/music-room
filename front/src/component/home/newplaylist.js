import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { Actions } from "react-native-router-flux";
import { TextField } from "react-native-ui-lib";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { createPlaylist } from "../../actions/playlist";
import Toaster from "../toaster";

class NewPlaylist extends Component {
  renderTextField = ({ input, label, secureTextEntry }) => (
    <TextField
      color="black"
      style={{ width: 300 }}
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
    event.type = this.props.typePlaylist;
    this.props.dispatch(createPlaylist(event));
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Text>New Track</Text>
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
        <Button
          title="Import Playlist"
          onPress={() => {
            Actions.importList();
          }}
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

NewPlaylist = reduxForm({
  form: "signupForm",
  validate,
})(NewPlaylist);

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

export default connect(mapStateToProps, mapDispatchToProps)(NewPlaylist);
