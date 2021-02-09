import express from "express";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import config from "./config";
import { send } from "./src/utils/sendEmail";

const port = 8080;
const app = express();
const server = http.createServer(app);

const createRouter = require("./src/routes").createRouter;

mongoose.Promise = Promise;

mongoose.connect(
  `mongodb://${config.local.host}:${config.local.dbPort}/${config.local.dbName}`,
  { keepAlive: true, reconnectTries: Number.MAX_VALUE, useNewUrlParser: true }
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Request-Method",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "*, X-Expiry, X-Client, X-Access-Token, X-pass, X-Uuid, Content-Type, Authorization"
  );

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// db connexion

const db = mongoose.connection;
db.on("error", () => {
  process.exit(1);
});

// test mail

app.post("/test/sendmail", (req, res) => {
  send(
    "nonreply@musicroon.tqt",
    "xonini9655@febeks.com",
    "Account validation",
    {
      code: "v2",
      name: "beautetoutcourt",
    }
  );
});

db.once("open", () => {
  createRouter(app);
  server.listen(config.local.port, () => {
    console.log(
      `Example app listening at http://localhost:${config.local.port}`
    );
  });
});
