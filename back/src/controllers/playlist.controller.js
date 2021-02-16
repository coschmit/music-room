import Playlist from "../models/playlist.model";
import User from "../models/user.model";
import filter from "filter-object";
import _ from "lodash";
import request from "superagent";

const createParams = "{name,description,type,users,songs}";
const updateParamsPrivate = "{type,email}";
const updateParamsPublic = "{songs,users,description,type}";

const test = (list, id, email) => {
  return new Promise((resolve, reject) => {
    Playlist.findOne({ name: list.name }).then((u) => {
      if (u) {
        return reject("An playList already exist with this name.");
      }

      request
        .get(`https://api.deezer.com/playlist/${list.id}`)
        .set("Accept", "application/json")
        .then((res) => {
          const body = JSON.parse(res.text);
          if (body.error) {
            resolve();
          }
          const tmp = [];

          if (body && body.tracks && body.tracks.data) {
            body.tracks.data.forEach((t, key) => {
              tmp.push({ id: t.id, name: t.title, grade: key });
            });
          }

          const playList = new Playlist({
            name: list.name,
            description: list.description,
            type: "public",
            users: [{ id, role: "RW", email, super: true }],
            songs: tmp,
          });

          playList.save((err) => {
            if (err) {
              reject("internal serveur error");
            }
            resolve();
          });
        })
        .catch(() => {
          return reject(e.response.body.message || e.message);
        });
    });
  });
};

export default class PlaylistController {
  static create(req, res) {
    const params = filter(req.body, createParams);
    if (!params || !params.name) {
      return res.status(401).send({ message: "Messing parameters." });
    }

    Playlist.findOne({ name: params.name })
      .then((u) => {
        if (u) {
          return res
            .status(400)
            .send({ message: "An playlist already exist with this name" });
        }

        const playlist = new Playlist({
          name: params.name,
          description: params.description,
          type: params.type,
          users: params.users,
        });

        playlist.save((err) => {
          if (err) {
            return res.status(500).send({ message: "internal server error" });
          }
          return res.json({ message: "Your playlist", playlist: playlist });
        });
      })
      .catch(() => {
        return res.status(500).send({ message: "Internal server error" });
      });
  }

  static getPlaylistAll(req, res) {
    Playlist.find()
      .then((playlists) => {
        const arrayToSend = [];

        playlists.forEach((playList) => {
          playList.users.forEach((u) => {
            if (u.id === req.params.userId && playList.type === "private") {
              arrayToSend.push(playList);
            }
          });
        });
        playlists.forEach((playList) => {
          if (playList.type === "public") {
            arrayToSend.push(playList);
          }
        });
        playlists.forEach((p) => {
          p.songs = _.sortBy(p.songs, ["grade"]);
        });
        return res.json({
          message: "Your playlists",
          playlists: arrayToSend,
        });
      })
      .catch(() => {
        return res.status(500).send({ message: "Internal serveur error" });
      });
  }

  static addMusicToList(req, res) {
    Playlist.findOne({ _id: req.params.playlistId }).then((playlist) => {
      if (!playlist) {
        return res.status(404).send({ message: "No playlist found" });
      }
      let test = false;
      playlist.users.forEach((u) => {
        if (u.id === req.params.userId && u.role === "RW") {
          test = true;
        }
      });
      if (!test) {
        return res
          .status(403)
          .send({ message: "Your are not allowed to access this playlist" });
      }
      const songs = playlist.songs;
      songs.push({
        id: req.params.newId,
        grade: songs.length - 1,
        name: req.params.songName,
      });
      Playlist.findOneAndUpdate(
        { _id: req.params.playlistId },
        { $set: { songs } },
        { new: true }
      )
        .then((playlist) => {
          playlist.songs = _.sortBy(playlist.songs, ["grade"]);
          return res.json({ message: "Your playlist", playlist });
        })
        .catch((e) => {
          return res.status(500).send({ message: "Internal server error" });
        });
    });
  }

  static updatePublic(req, res) {
    const params = filter(req.body, updateParamsPublic);

    Playlist.findOne({ _id: req.params.playlistId }).then((playlist) => {
      if (!playlist) {
        return res.status(404).send({ message: "No playlist found" });
      }

      let test = false;
      playlist.users.forEach((u) => {
        if (u.id === req.params.userId && u.role === "RW") {
          test = true;
        }
      });
      if (!test) {
        return res
          .status(403)
          .send({ message: "You are not allowed to access this playlist" });
      }

      Playlist.findOneAndUpdate(
        { _id: req.params.playlistId },
        { $set: params },
        { new: true }
      )
        .then((playlist) => {
          playlist.songs = _.sortBy(playlist.songs, ["grade"]);

          return res.json({ message: "Your playlist", playlist });
        })
        .catch(() => {
          return res.status(500).send({ message: "Internal server error" });
        });
    });
  }

  static updatePrivate(req, res) {
    const params = filter(req.body, updateParamsPrivate);

    Playlist.findOne({ _id: req.params.playlistId }).then((playlist) => {
      if (!playlist) {
        return res.status(404).send({ message: "No playlist found" });
      }
      User.findOne({ email: params.email }).then((user) => {
        if (!user) {
          return res.status(404).send({ message: "No user found" });
        }
        if (user._id.toString() === req.params.userId) {
          return res.status(403).send({ message: "You can't add yourself" });
        }
        let test = false;
        let doubleUser = false;
        let index = -1;
        playlist.users.forEach((u, key) => {
          if (u.id === req.params.userId && u.role === "RW") {
            test = true;
          }
          if (user._id.toString() === u.id) {
            doubleUser = true;
            index = key;
          }
        });
        if (!test) {
          return res
            .status(403)
            .send({ message: "You are not allowed to access this playlist" });
        }

        const users = playlist.users;
        let tmpT = "R";
        if (params.type.toString() === "read") {
          tmpT = "R";
        }
        if (params.type.toString() === "read&&write") {
          tmpT = "RW";
        }
        if (!doubleUser) {
          users.push({
            id: user.id,
            role: tmpT,
            email: user.email,
            super: false,
          });
        } else {
          users[index] = {
            id: user.id,
            role: tmpT,
            email: user.email,
            super: false,
          };
        }

        Playlist.findOneAndUpdate(
          { _id: req.params.playlistId },
          { $set: { users } },
          { new: true }
        )
          .then((playlist) => {
            playlist.songs = _.sortBy(playlist.songs, ["grade"]);

            return res.json({ message: "Your playlist", playlist });
          })
          .catch(() => {
            return res.status(500).send({ message: "Internal serveur error" });
          });
      });
    });
  }

  static deleteUser(req, res) {
    Playlist.findOne({ _id: req.params.playlistId }).then((playlist) => {
      if (!playlist) {
        return res.status(404).send({ message: "No playlist found" });
      }

      let index = -1;
      playlist.users.forEach((u, key) => {
        if (req.params.targetId.toString() === u.id) {
          index = key;
        }
      });

      playlist.users.splice(index, 1);
      Playlist.findOneAndUpdate(
        { _id: req.params.playlistId },
        { $set: { users: playlist.users } },
        { new: true }
      )
        .then((playlist) => {
          playlist.songs = _.sortBy(playlist.songs, ["grade"]);
          return res.json({ message: "Your playlist", playlist });
        })
        .catch((e) => {
          return res.status(500).send({ message: "Internal server error" });
        });
    });
  }

  static importPlayList(req, res) {
    const playListArray = req.body.playListArray;
    const promiseArra = [];
    User.findOne({ _id: req.params.userId }).then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      playListArray.forEach((e) => {
        promiseArra.push(test(e, user.id, user.email));
      });
      Promise.all(promiseArra).then(() => {
        Playlist.find().then((playlists) => {
          const arrayToSend = [];

          playlists.forEach((playList) => {
            playList.users.forEach((u) => {
              if (u.id === req.params.userId && playList.type === "private") {
                arrayToSend.push(playList);
              }
            });
          });
          playlists.forEach((playList) => {
            if (playList.type === "public") {
              arrayToSend.push(playList);
            }
          });
          playlists.forEach((p) => {
            p.songs = _.sortBy(p.songs, ["grade"]);
          });
          return res.json({
            message: "Your playlists",
            playlists: arrayToSend,
          }); /* istanbul ignore next */
        });
      });
    });
  }
}
