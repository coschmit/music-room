import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { Actions } from "react-native-router-flux";
import { ChipsInput, TagsInput, TextField } from "react-native-ui-lib";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import RadioGroup from "../radioGroup";
import { updateUser } from "../../actions/user";

class Public extends Component {
  state = { tags: this.props.initialValues.musicTags };

  renderTextField = ({ input, label, secureTextEntry }) => (
    <TextField
      color="black"
      style={{ width: "100%" }}
      placeholder={label}
      {...input}
      secureTextEntry={secureTextEntry}
    />
  );

  renderRadioGroup = ({ input }) => (
    <RadioGroup
      options={["public", "friendOnly"]}
      onChange={(a) => {
        input.onChange(a);
      }}
    />
  );

  renderTags = () => (
    <ChipsInput
      containerStyle={{ marginBottom: 20, width: "100%" }}
      placeholder="Music Tags"
      tags={this.state.tags}
      onChangeTags={(tags) => this.setState({ tags })}
      getLabel={(tag) => tag.label}
      inputStyle={{ fontSize: 20 }}
      renderTag={(tag) => (
        <View
          style={{
            backgroundColor: "#59BC83",
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 8,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "white" }}>{tag}</Text>
        </View>
      )}
      hideUnderline={true}
    />
  );

  onSubmit = (event) => {
    event.musicTags = this.state.tags;
    event.isPrivateInfo = event.isPrivateInfo === "public";
    this.props.dispatch(updateUser(event, this.props.user.id));
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: "80%",
          alignSelf: "center",
          alignItems: "center",
          paddingBottom: 20,
          borderColor: "#969493",
          borderBottomWidth: 1,
        }}
      >
        <Field
          label="Firstname"
          name="firstName"
          component={this.renderTextField}
        />
        <Field
          label="Lastname"
          name="lastName"
          component={this.renderTextField}
        />
        <Field label="MusicTags" name="musicTags" component={this.renderTags} />
        <Field
          label={"isPrivateInfo"}
          name={"isPrivateInfo"}
          component={this.renderRadioGroup}
        />
        <View style={{ marginTop: 20 }}>
          <Button
            title="Update"
            color="#59BC83"
            onPress={this.props.handleSubmit(this.onSubmit)}
          />
        </View>
      </View>
    );
  }
}

const validate = () => {
  const errors = {};
  return errors;
};

Public = reduxForm({
  form: "signupForm",
  validate,
})(Public);

const mapStateToProps = (state) => {
  return {
    user: state.user.toJS(),
    initialValues: state.user.toJS(),
    notife: state.notife.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Public);
