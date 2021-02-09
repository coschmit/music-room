import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import reducer from "./src/reducers";
import thunk from "redux-thunk";

import Main from "./src/main";
import simpleMiddleWare from "./src/middleware";

const configureStore = (reducer) =>
  createStore(
    combineReducers({
      user: reducer.user,
      playlist: reducer.playlist,
      room: reducer.room,
      notife: reducer.notife,
      classement: reducer.classement,
      form: formReducer,
    }),
    applyMiddleware(simpleMiddleWare(), thunk)
  );

const store = configureStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
