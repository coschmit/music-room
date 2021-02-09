import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import { TextField } from "react-native-ui-lib";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { signupUser } from "../../actions/user";
import Toaster from "../toaster/index";

class Signup extends Component {
  renderTextField = ({ input, label, secureTextEntry }) => (
    <TextField
      style={{ width: "100%" }}
      text50
      underlineColor={{
        default: "#828E99",
        error: "#FF4949",
        focus: "#6BE09C",
        disabled: "grey",
      }}
      placeholder={label}
      {...input}
      secureTextEntry={secureTextEntry}
    />
  );

  onSubmit = (event) => {
    // SignupUser
    this.props.dispatch(signupUser(event));
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <View style={{ flex: 1, padding: 40, marginTop: "25%" }}>
        <View
          style={{
            marginTop: 20,
            width: "90%",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          <Field
            label={"First Name"}
            name={"firstName"}
            component={this.renderTextField}
          />
          <Field
            label={"Last Name"}
            name={"lastName"}
            component={this.renderTextField}
          />
          <Field
            label={"Email"}
            name={"email"}
            component={this.renderTextField}
          />
          <Field
            label={"Password"}
            name={"password"}
            component={this.renderTextField}
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={handleSubmit(this.onSubmit)}
            activeOpacity={0.8}
          >
            <Text style={styles.txt}>Signup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#393639" }]}
            onPress={() => {
              Actions.login();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.txt}>Login</Text>
          </TouchableOpacity>
        </View>
        {this.props.notife.message !== "" && (
          <Toaster msg={this.props.notife.message} />
        )}
      </View>
    );
  }
}

const validate = (values) => {
  const errors = {};
  const requiredFields = ["email", "password", "lastName", "firstName"];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  return errors;
};

Signup = reduxForm({
  form: "signupForm",
  validate,
})(Signup);

const mapStateToProps = (state) => {
  return {
    notife: state.notife.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginVertical: 10,
    backgroundColor: "#6BE09C",
  },
  txt: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
