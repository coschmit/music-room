import jwt from "jsonwebtoken";
import config from "../../config";

export const isLogin = (req, res) => {
  return new Promise((resolve) => {
    const token = req.headers["x-access-token"];
    jwt.verify(token, config.local.jwtSecret, (err, decode) => {
      if (
        err ||
        (decode.id !== req.params.id && decode._id !== req.params.id)
      ) {
        return res.status(403).send({ message: "forbidden" });
      }
      resolve();
    });
  });
};
