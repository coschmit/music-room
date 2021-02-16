import React, { Component } from "react";
import { View, Button } from "react-native";
import { TextField } from "react-native-ui-lib";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { facebookLinkAction, updateUserPrivate } from "../../actions/user";
import { LoginButton, AccessToken } from "react-native-fbsdk";

class Private extends Component {
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
    this.props.dispatch(updateUserPrivate(event, this.props.user.id));
  };

  render() {
    const { user, handleSubmit } = this.props;
    return (
      <View
        style={{
          flex: 1,
          width: "80%",
          alignSelf: "center",
          borderBottomWidth: 1,
          paddingBottom: 20,
        }}
      >
        <Field label="Email" name="email" component={this.renderTextField} />
        <Field
          label="Password"
          name="password"
          secureTextEntry={true}
          component={this.renderTextField}
        />
        <Button
          color="#59BC83"
          onPress={handleSubmit(this.onSubmit)}
          title="Update"
        />
        {/* {!user.isFaceBookLogin && ( */}

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <LoginButton
            onLoginFinished={(error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then((data) => {
                  this.props.dispatch(
                    facebookLinkAction(data, this.props.user.id)
                  );
                });
              }
            }}
            onLogoutFinished={() => console.log("logout.")}
          />
        </View>

        {/* )} */}
      </View>
    );
  }
}

const validate = () => {
  const errors = {};

  return errors;
};

Private = reduxForm({
  form: "signupForm",
  validate,
})(Private);

const mapStateToProps = (state) => {
  return {
    user: state.user.toJS(),
    notife: state.notife.toJS(),
  };
};
const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Private);
