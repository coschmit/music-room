import React from "react";
import { ActionBar } from "react-native-ui-lib";

const Menu = ({ serviceMode, playlistMode, settingsMode }) => {
  return (
    <ActionBar
      backgroundColor="#59BC83"
      actions={[
        { label: "Track Vote", onPress: () => serviceMode(), white: true },
        {
          label: "Playlist Editor",
          onPress: () => playlistMode(),
          white: true,
        },
        { label: "Settings", onPress: () => settingsMode(), white: true },
      ]}
    />
  );
};

export default Menu;
