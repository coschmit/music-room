import React, { Component } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { TextField } from "react-native-ui-lib";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { deleteRoomUser, updatePrivateRoom } from "../../actions/room";
import RadioGroup from "../radioGroup";
class AddNewUser extends Component {
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
      options={["read", "read&&write"]}
      onChange={(a) => {
        input.onChange(a);
      }}
    />
  );

  onSubmit = (event) => {
    this.props.dispatch(
      updatePrivateRoom(event, this.props.plId, this.props.userId)
    );
  };

  render() {
    const { handleSubmit, users, dispatch } = this.props;
    return (
      <View style={{ flex: 1, width: "80%", alignItems: "center" }}>
        <Field
          label={"Email"}
          name={"email"}
          component={this.renderTextField}
        />
        <Field label={"type"} name={"type"} component={this.renderRadioGroup} />
        <Button
          color="#59BC83"
          onPress={handleSubmit(this.onSubmit)}
          title="Add"
        />
        {!!users && users.length !== 0 && (
          <FlatList
            data={users}
            renderItem={({ item, index }) => {
              console.log("u,key", item, index);
              return item.super === true ? (
                <View key={index} />
              ) : (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Icon
                    raised
                    name="delete"
                    type="delete"
                    color="#59BC83"
                    onPress={() => {
                      this.props.dispatch(
                        deleteRoomUser(
                          this.props.plId,
                          this.props.userId,
                          item.id
                        )
                      );
                    }}
                  />
                  <Icon
                    raised
                    name="compare-arrows"
                    type="compare-arrows"
                    color="#59BC83"
                    onPress={() => {
                      this.props.dispatch(
                        updatePrivateRoom(
                          {
                            email: item.email,
                            type: item.role !== "R" ? "read" : "read&&write",
                          },
                          this.props.plId,
                          this.props.userId
                        )
                      );
                    }}
                  />
                  <Text>{item.email}</Text>
                  <Text>{` Role: ${item.role}`}</Text>
                </View>
              );
            }}
          />
        )}
      </View>
    );
  }
}

const validate = (values) => {
  const errors = {};
  const requiredFields = ["email", "type"];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  return errors;
};

AddNewUser = reduxForm({
  form: "signupForm",
  validate,
})(AddNewUser);

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

export default connect(mapStateToProps, mapDispatchToProps)(AddNewUser);
