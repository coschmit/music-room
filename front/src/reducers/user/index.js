import { fromJS } from "immutable";
import jwtDecode from "jwt-decode";
import { Actions } from "react-native-router-flux";
import * as SecureStore from "expo-secure-store";

export function login(state, data) {
  const user = jwtDecode(data.token);
  SecureStore.setItemAsync("token", data.token, {});
  setTimeout(() => {
    Actions.home();
  }, 100);

  return state
    .setIn(["email"], fromJS(user.email))
    .setIn(["isAuthenticated"], fromJS(true))
    .setIn(["role"], fromJS(user.role))
    .setIn(["lastName"], fromJS(user.lastName))
    .setIn(["firstName"], fromJS(user.firstName))
    .setIn(["isActive"], fromJS(user.isActive))
    .setIn(["id"], fromJS(user.id))
    .setIn(["musicTags"], fromJS(user.musicTags))
    .setIn(["isFaceBookLogin"], fromJS(user.isFaceBookLogin))
    .setIn(["friends"], fromJS(user.friends || []));
}

export function verifeUser(state, token) {
  const user = jwtDecode(token);
  SecureStore.setItemAsync("token", token, {});

  return state
    .setIn(["email"], fromJS(user.email))
    .setIn(["isAuthenticated"], fromJS(true))
    .setIn(["name"], fromJS(user.name))
    .setIn(["id"], fromJS(user.id))
    .setIn(["firstName"], fromJS(user.firstName))
    .setIn(["lastName"], fromJS(user.lastName))
    .setIn(["isActive"], fromJS(user.isActive))
    .setIn(["isFaceBookLogin"], fromJS(user.isFaceBookLogin))
    .setIn(["musicTags"], fromJS(user.musicTags || []))
    .setIn(["friends"], fromJS(user.friends || []));
}
