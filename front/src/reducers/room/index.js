import { fromJS } from "immutable";

export function setListOfRoom(state, data) {
  return state.setIn(["rooms"], fromJS(data.rooms));
}

export function updateListOfRoom(state, data) {
  const rooms = state.getIn(["rooms"]).toJS();
  rooms.push(data.room);
  return state.setIn(["rooms"], fromJS(rooms));
}

export function updateRoom(state, data) {
  const rooms = state.getIn(["rooms"]).toJS();
  const index = rooms.findIndex((e) => e._id === data.roomId);

  if (index === -1) {
    return state;
  }

  rooms[index] = data.body.room;

  return state.setIn(["rooms"], fromJS(rooms));
}
