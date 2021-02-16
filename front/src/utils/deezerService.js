import { NativeModules } from "react-native";

const DeezerManager = NativeModules.DeezerManager;

export function playTrack(id) {
  return new Promise((resolve) => {
    DeezerManager.playTrack(id).then((res) => {
      resolve(res);
    });
  });
}

export function play() {
  DeezerManager.play();
}

export function pause() {
  DeezerManager.pause();
}

export function isPlayingDeezer(cb) {
  DeezerManager.isPlaying(cb);
}

export function checkSession(cb) {
  DeezerManager.isSessionValid(cb);
}

export function getPlaylists() {
  return new Promise((resolve) => {
    DeezerManager.getPlaylists()
      .then((res) => {
        resolve(res);
      })
      .catch((e) => console.log("error getplaylist", e));
  });
}

export function connectDeezer() {
  return new Promise((resolve, rejetc) => {
    DeezerManager.connect((decision) => {
      decision ? resolve(decision) : rejetc(decision);
    });
  });
}

export function disconnectDeezer() {
  return new Promise((resolve) => {
    DeezerManager.disconnect((test) => {
      resolve(test);
    });
  });
}
