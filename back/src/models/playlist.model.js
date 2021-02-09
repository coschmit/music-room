import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  location: {},
  name: String,
  description: String,
  type: String, // prive(0) public(else)
  users: Array, // [{id: 'id', role: 'role', email: 'email', super: false}] R or RW
  songs: Array, // [{id: 'id', name: 'name', grade: 0}] grade is the index of the song in the Array
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);

export default Playlist;
