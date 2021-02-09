import { fromJS } from "immutable";

export function getClassement(state, data) {
  return state.setIn(["songs"], fromJS(data.classement.songs));
}
