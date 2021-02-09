import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text, View, Button } from "react-native";
import { Input } from "react-native-elements";
import { connect } from "react-redux";
import { resetPass } from "../../actions/user";
import Toaster from "../toaster/index";

const ResetPass = (props) => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSend, setIsSend] = useState(false);

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
        <Input
          value={email}
          placeholder="email"
          onChangeText={(value) => setEmail(value)}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setIsSend(true);
            props.dispatch(resetPass(email));
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.txt}>Send code</Text>
        </TouchableOpacity>
      </View>

      {isSend && (
        <View
          style={{
            marginTop: 20,
            width: "90%",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          <Input
            value={code}
            placeholder="code"
            onChangeText={(value) => setCode(value)}
          />
          <Input
            value={newPassword}
            placeholder="New Password"
            onChangeText={(value) => setNewPassword(value)}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setIsSend(true);
              //verify new pass func
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.txt}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {props.notife.message !== "" && <Toaster msg={props.notife.message} />}
    </View>
  );
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

const mapStateToProps = (state) => {
  return {
    notife: state.notife.toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPass);
