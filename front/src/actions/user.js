import { callApi } from "../utils/callApi";
import { Actions } from "react-native-router-flux";

export function loginUser(event) {
  return (dispatch) => {
    callApi(`user/${event.email.toLowerCase()}`, "get", null, event.password)
      .then((body) => {
        return dispatch({
          type: "http/login",
          data: body,
        });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
}

export const signupUser = (event) => {
  event.email = event.email.toLowerCase();
  return (dispatch) => {
    callApi("user/create", "post", event)
      .then(() => {
        return Actions.code({ email: event.email });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
};

export function updateUser(event, userId) {
  return (dispatch) => {
    callApi(`user/update/${userId}`, "post", event)
      .then((body) => {
        return dispatch({
          type: "http/login",
          data: body,
        });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
}

export function updateUserPrivate(event, userId) {
  return (dispatch) => {
    callApi(`user/update/private/${userId}`, "post", event)
      .then((body) => {
        return dispatch({
          type: "http/login",
          data: body,
        });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
}

export const verifyUser = (code, email) => {
  return (dispatch) => {
    callApi(`user/verifyEmail/${email}/${code}`, "put")
      .then((body) =>
        dispatch({
          type: "http/login",
          data: body,
        })
      )
      .catch((e) =>
        dispatch({
          type: "client/addNotife",
          data: e,
        })
      );
  };
};

export function resetPass(email) {
  return (dispatch) => {
    callApi(`user/resetPassword/${email}`, "get")
      .then()
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
}

export function addFriend(email, userId) {
  return (dispatch) => {
    callApi(`user/addFriend/${email}/${userId}`, "put")
      .then((body) => {
        return dispatch({
          type: "http/login",
          data: body,
        });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
}

export function facebookLoginAction(event) {
  return (dispatch) => {
    callApi(`user/create/facebook`, "post", event)
      .then((body) => {
        return dispatch({
          type: "http/login",
          data: body,
        });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
}

export function facebookLinkAction(event, userId) {
  return (dispatch) => {
    callApi(`user/link/facebook/${userId}`, "post", event)
      .then((body) => {
        return dispatch({
          type: "http/login",
          data: body,
        });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
}
