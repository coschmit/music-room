import { fromJS } from "immutable";
import { getClassement } from "./classement";
import {
  setListOfPlaylist,
  updateListOfplayList,
  updatePlaylist,
} from "./playlist";
import { setListOfRoom, updateListOfRoom, updateRoom } from "./room";
import { login, verifeUser } from "./user/index";

const intialStateUser = {
  firstName: "",
  lastName: "",
  email: "",
  role: -1,
  isAuthenticated: false,
  url: "",
  isArbitrage: false,
  birthdate: null,
  goal: 0,
  language: "",
  funds: [],
  id: "",
};

const intialStatePlaylist = {
  playlists: [],
  nbr: 0,
};

const initialStateRoom = {
  rooms: [],
  nbr: 0,
};

const intialStateNotife = {
  message: "",
};

const initialClassement = {
  songs: [],
};

export default class reducer {
  static user(state = fromJS(intialStateUser), action) {
    switch (action.type) {
      case "http/login":
        return login(state, action.data);
      case "client/verifyUser":
        return verifeUser(state, action.data);
      default:
        return state;
    }
  }

  static playlist(state = fromJS(intialStatePlaylist), action) {
    switch (action.type) {
      case "http/getAllPlaylist":
        return setListOfPlaylist(state, action.data);
      case "http/newPlaylist":
        return updateListOfplayList(state, action.data);
      case "http/addSongPlaylist":
        return updatePlaylist(state, action.data);
      case "http/updatePlaylist":
        return updatePlaylist(state, action.data);
      default:
        return state;
    }
  }

  static room(state = fromJS(initialStateRoom), action) {
    switch (action.type) {
      case "http/getAllRoom":
        return setListOfRoom(state, action.data);
      case "http/newRoom":
        return updateListOfRoom(state, action.data);
      case "http/addRoomSong":
        return updateRoom(state, action.data);
      case "http/updateRoom":
        return updateRoom(state, action.data);
      default:
        return state;
    }
  }

  static classement(state = fromJS(initialClassement), action) {
    switch (action.type) {
      case "http/getClassement":
        return getClassement(state, action.data);
      case "http/updateClassement":
        return getClassement(state, action.data);
      default:
        return state;
    }
  }

  static notife(state = fromJS(intialStateNotife), action) {
    switch (action.type) {
      case "client/addNotife":
        return state.setIn(["message"], fromJS(action.data));
      case "client/delNotife":
        return state.setIn(["message"], fromJS(""));
      default:
        return state;
    }
  }
}
