import { fromJS } from "immutable";

export function updateListOfplayList(state, data) {
  const playlists = state.getIn(["playlists"]).toJS();
  playlists.push(data.playlist);
  return state.setIn(["playlists"], fromJS(playlists));
}

export function setListOfPlaylist(state, data) {
  return state.setIn(["playlists"], fromJS(data.playlists));
}

export function updatePlaylist(state, data) {
  console.log("STEP667");
  console.log("updatePlaylist here", state, data);
  const playlists = state.getIn(["playlists"]).toJS();
  const index = playlists.findIndex((e) => e._id === data.playlistId);

  if (index === -1) {
    return state;
  }
  playlists[index] = data.body.playlist;
  return state.setIn(["playlists"], fromJS(playlists));
}
