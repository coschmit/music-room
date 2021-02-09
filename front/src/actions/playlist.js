import { Actions } from "react-native-router-flux";
import { callApi } from "../utils/callApi";

export function getPlaylist(userId) {
  return (dispatch) => {
    callApi(`playlist/all/${userId}/`, "get")
      .then((body) => {
        console.log("okkkk", body);
        return dispatch({
          type: "http/getAllPlaylist",
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

export function createPlaylist(data) {
  return (dispatch) => {
    callApi(`playlist/create`, "post", data)
      .then((body) => {
        Actions.home({ mode: 1 });
        return dispatch({
          type: "http/newPlaylist",
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

export function updatePlaylist(data, playlistId, userId) {
  return (dispatch) => {
    callApi(`playlist/update/${playlistId}/${userId}`, "post", data)
      .then((body) => {
        return dispatch({
          type: "http/updatePlaylist",
          data: { body, playlistId },
        });
      })
      .catch((e) => {
        return dispatch({ type: "client/addNotife", data: e });
      });
  };
}

export function addPlaylistSong(id, playlistId, userId, songName) {
  return (dispatch) => {
    callApi(`playlist/update/${playlistId}/${userId}/${id}/${songName}`, "put")
      .then((body) => {
        console.log("STEP666");
        return dispatch({
          type: "http/addSongPlaylist",
          data: { body, playlistId },
        });
      })
      .catch((e) => {
        console.log("STEP BRUH", e);
        return disptach({ type: "client/addNotife", data: e });
      });
  };
}

export function updatePrivatePlaylist(data, playlistId, userId) {
  return (dispatch) => {
    callApi(`playlist/updatePrivate/${playlistId}/${userId}`, "post", data)
      .then((body) => {
        return dispatch({
          type: "http/updatePlaylist",
          data: { body, playlistId },
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

export function deletePlaylistUser(playlistId, userId, targetId) {
  return (dispatch) => {
    callApi(`playlist/delete/user/${playlistId}/${userId}/${targetId}`, "put")
      .then((body) => {
        console.log("DONE DELETE");
        return dispatch({
          type: "http/updatePlaylist",
          data: { body, playlistId },
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

export function importDeezerList(userId, playListArray) {
  return (dispatch) => {
    playListArray.forEach((e) => {
      e.name = e.title;
      e.type = "private";
    });
    callApi(`playlist/import/list/${userId}`, "post", { playListArray })
      .then((body) => {
        return dispatch({
          type: "http/getAllplayList",
          data: body,
        });
      })
      .catch((e) => {
        dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
}
