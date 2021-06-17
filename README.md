# Music-room

🇫🇷
Projet en partenariat avec Deezer. Création d'une application mobile complète de playlist collaborative en utilisant les SDK et API de Deezer. Au programme : du développement natif mobile, du développement de back-end et de la création d'API REST.

🇺🇸
Project in partnership with Deezer. Creation of a complete mobile collaborative playlist application using Deezer's SDKs and APIs. On the program: native mobile development, back-end development and the creation of REST APIs.


## Run Application
```
cd front
npm i
```
for ios ```npm run ios```
for android ```npx react-native run-android```

# Start Server

* Start mongo ```mongod --dbpath mongo```
* Start server```cd server && yarn && yarn start-dev```


# Monnitoring
* Pm2 && keymetrics

# Benchmark
* Siege
* siege -c 50 ``localhost:8080/users`` (ec2 adresse)
* Open htop on server and keymetrics


## Images

### Rooms
![Rooms](https://github.com/coschmit/music-room/blob/main/README_img/select_room_page.jpg)
<img src="https://github.com/coschmit/music-room/blob/main/README_img/select_room_page.jpg" alt="" width="300"/>

### Map
![Map](https://github.com/coschmit/music-room/blob/main/README_img/map_page.jpg)

### Room Player
![Player](https://github.com/coschmit/music-room/blob/main/README_img/room_page.jpg)

### Add songs
![AddSongs](https://github.com/coschmit/music-room/blob/main/README_img/search_song_page.png)

