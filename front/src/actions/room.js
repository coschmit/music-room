import { Actions } from "react-native-router-flux";
import { callApi } from "../utils/callApi";

export const createRoom = (data) => {
  return (dispatch) => {
    callApi("room/create", "post", data)
      .then((body) => {
        Actions.home();
        return dispatch({
          type: "http/newRoom",
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
};

export const getRoom = (user) => {
  return (dispatch) => {
    callApi(`room/all/${user.userId}/${user.lat}/${user.long}`, "get")
      .then((body) => {
        console.log("room/all", body);
        return dispatch({
          type: "http/getAllRoom",
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
};

export const updateRoom = (data, roomId, userId) => {
  return (dispatch) => {
    callApi(`room/update/${roomId}/${userId}`, "post", data)
      .then((body) => {
        return dispatch({
          type: "http/updateRoom",
          data: { body, roomId },
        });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
};

export function updatePrivateRoom(data, roomId, userId) {
  return (dispatch) => {
    callApi(`room/updatePrivate/${roomId}/${userId}`, "post", data)
      .then((body) => {
        console.log("putepute", body);
        return dispatch({
          type: "http/updateRoom",
          data: { body, roomId },
        });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNNotife",
          data: e,
        });
      });
  };
}

export function deleteRoomUser(roomId, userId, targetId) {
  return (dispatch) => {
    callApi(`room/delete/user/${roomId}/${userId}/${targetId}`, "put")
      .then((body) => {
        return dispatch({
          type: "http/updateRoom",
          data: { body, roomId },
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

export const addRoomSong = (id, roomId, userId, songName) => {
  return (dispatch) => {
    callApi(`room/update/${roomId}/${userId}/${id}/${songName}`, "put")
      .then((body) => {
        return dispatch({
          type: "http/addRoomSong",
          data: { body, roomId },
        });
      })
      .catch((e) => {
        return dispatch({
          type: "client/addNotife",
          data: e,
        });
      });
  };
};
