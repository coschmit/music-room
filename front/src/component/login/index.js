import React, { Component } from "react";
import { TextField } from "react-native-ui-lib";
import { Actions } from "react-native-router-flux";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { facebookLoginAction, loginUser } from "../../actions/user";
import Toaster from "../toaster";
import { LoginButton, AccessToken } from "react-native-fbsdk";
import { Input } from "react-native-elements";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

class Login extends Component {
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
    this.props.dispatch(loginUser(event));
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
            <Text style={styles.txt}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#393639" }]}
            onPress={() => {
              Actions.signup();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.txt}>Signup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: "#393639", marginBottom: 20 },
            ]}
            onPress={() => {
              Actions.resetPass();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.txt}>reset password</Text>
          </TouchableOpacity>

          <LoginButton
            permissions={["email"]}
            style={{ width: "100%", height: 40, paddingVertical: 10 }}
            onLoginFinished={(error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then((data) => {
                  this.props.dispatch(facebookLoginAction(data));
                });
              }
            }}
            onLogoutFinished={() => console.log("logout.")}
          />
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
  const requiredFields = ["email", "password"];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  return errors;
};

Login = reduxForm({
  form: "loginForm",
  validate,
})(Login);

const mapStateToProps = (state) => {
  return { notife: state.notife.toJS() };
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
