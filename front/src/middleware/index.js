import { Actions } from "react-native-router-flux";
import jwtDecode from "jwt-decode";
import * as SecureStore from "expo-secure-store";

function verifyUser(token) {
  return {
    type: "client/verifyUser",
    data: token,
  };
}

const simpleMiddleWare = () => ({ dispatch }) => {
  return (next) => (action) => {
    return SecureStore.getItemAsync("token", {}).then((token) => {
      if (
        token &&
        (Actions.currentScene === "login" || Actions.currentScene === "signup")
      ) {
        const tmpToken = jwtDecode(token);
        if (tmpToken.isActive) {
          Actions.home();
          return dispatch(verifyUser(token));
        }
      }

      if (Actions.currentScene === "home" && !token) {
        return Actions.login();
      }

      return next(action);
    });
  };
};

export default simpleMiddleWare;
