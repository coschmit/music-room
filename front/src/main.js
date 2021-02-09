import React from "react";
import { Router, Scene, Stack } from "react-native-router-flux";
import Home from "./component/home";
import EditRoom from "./component/home/editroom";
import NewRoom from "./component/home/newRoom";
import Login from "./component/login";
import ResetPass from "./component/login/resetPass";
import Signup from "./component/signup";
import Code from "./component/signup/code";
import MapRoom from "./component/mapRoom";
import Classement from "./component/home/classement";
import NewPlaylist from "./component/home/newplaylist";
import editPlaylist from "./component/home/editPlaylist";
import ImportList from "./component/home/importPlaylist";
import Friends from "./component/settings/friends";
import ShowProfile from "./component/settings/showProfile";

const Main = () => {
  return (
    <Router>
      <Stack hideNavBar key="root">
        <Scene key="login" component={Login} title="Login" initial />
        <Scene key="signup" component={Signup} title="Signup" />
        <Scene key="code" component={Code} title="Code" />
        <Scene key="resetPass" component={ResetPass} title="ResetPass" />
        <Scene key="home" component={Home} title="home" />
        <Scene
          key="editRoom"
          component={EditRoom}
          title="Edit The Room"
          hideNavBar={false}
        />
        <Scene
          key="newRoom"
          component={NewRoom}
          title="Room Creation"
          hideNavBar={false}
        />
        <Scene
          key="map"
          component={MapRoom}
          hideNavBar={false}
          title="Map of rooms"
        />
        <Scene
          key="newPlaylist"
          component={NewPlaylist}
          hideNavBar={false}
          title="New Playlist"
        />
        <Scene
          key="classement"
          component={Classement}
          hideNavBar={false}
          title="Top music"
        />
        <Scene
          key="editPlaylist"
          component={editPlaylist}
          hideNavBar={false}
          title="Playlist"
        />
        <Scene
          key="importList"
          component={ImportList}
          hideNavBar={false}
          title="Import your playlist"
        />
        <Scene
          key="friend"
          component={Friends}
          hideNavBar={false}
          title="Friends"
        />
        <Scene
          key="showProfile"
          component={ShowProfile}
          hideNavBar={false}
          title="Your friend"
        />
      </Stack>
    </Router>
  );
};

export default Main;
