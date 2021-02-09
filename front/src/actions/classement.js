import { callApi } from "../utils/callApi";

export function getClassement() {
  return (dispatch) => {
    callApi("classement/all", "get")
      .then((body) => {
        return dispatch({
          type: "http/getClassement",
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

export function createClassement(data) {
  return (dispatch) => {
    callApi("classement/create", "post", data)
      .then((body) => {
        console.log("thenn then");
        return dispatch({
          type: "http/getClassement",
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

export function updateClassement(songs) {
  return (dispatch) => {
    callApi(`classement/update`, "post", { songs })
      .then((body) => {
        console.log("THEN call api", body);
        return dispatch({
          type: "http/updateClassement",
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
