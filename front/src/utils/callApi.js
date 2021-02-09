import request from "superagent";
import * as SecureStore from "expo-secure-store";

let serverUrl = "http://localhost:8080";

export const callApi = (endpoint, method = "get", body, psw) => {
  return new Promise((resolve, reject) => {
    SecureStore.getItemAsync("token", {}).then((token) => {
      if (method === "post") {
        request
          .post(`${serverUrl}/${endpoint}`)
          .send(body)
          .set("Accept", "application/json")
          .set("X-Access-Token", token || "")
          .then((res) => {
            const body = JSON.parse(res.text);
            return resolve(body);
          })
          .catch((e) => {
            return reject(e.response.body.message || e.message);
          });
      }
      if (method === "get") {
        return request
          .get(`${serverUrl}/${endpoint}`)
          .set("Accept", "application/json")
          .set("X-Access-Token", token || "")
          .set("X-Pass", psw)
          .then((res) => {
            const body = JSON.parse(res.text);
            return resolve(body);
          })
          .catch((e) => {
            console.log("err callApi", e);
            return reject(e.response.body.message);
          });
      }

      if (method === "put") {
        request
          .put(`${serverUrl}/${endpoint}`)
          .send(body)
          .set("Accept", "application/json")
          .set("X-Access-Token", token || "")
          .then((res) => {
            const body = JSON.parse(res.text);
            return resolve(body);
          })
          .catch((e) => reject(e.response.body.message || e.message));
      }
    });
  });
};
