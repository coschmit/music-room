import User from "../models/user.model";
import filter from "filter-object";
import { generateToken } from "../utils/token";
import { send } from "../utils/sendEmail";
import bcrypt from "bcryptjs";
import FB from "fb";

const createParams = "{email,password,firstName,lastName,url,bio}";
const updateParamsPublic = "{firstName,lastName,tags,musicTags,isPrivateInfo}";
const updateParamsPrivate = "{password,email}";

const createCode = () => {
  let str = "";
  for (let i = 0; i < 6; i++) {
    str += Math.floor(Math.random() * Math.floor(10));
  }
  return str;
};

export default class UserController {
  static create(req, res) {
    const params = filter(req.body, createParams);
    if (
      !params ||
      !params.email ||
      !params.password ||
      !params.firstName ||
      !params.lastName
    ) {
      return res.status(401).send({ message: "Messing parameters" });
    }

    User.findOne({ email: params.email })
      .then((u) => {
        if (u) {
          return res
            .status(400)
            .send({ message: "An account already exist with this email." });
        }
        const email = params.email;
        const tokenStr = createCode();
        send("noreply@musicroom.tqt", email, "Account validation", {
          code: tokenStr,
          name: params.firstName,
        });

        const user = new User({
          email: params.email,
          isActive: false,
          url: params.url,
          firstName: params.firstName,
          lastName: params.lastName,
          bio: params.bio,
          isFacebookLogin: false,
          isEmailVerified: false,
          isEmailVerifiedToken: tokenStr,
        });
        user.generateHash(params.password);
        user.save((err) => {
          if (err) {
            return res.status(500).send({ message: "internal serveur error" });
          }
          const token = generateToken(user);
          return res.json({ token });
        });
      })
      .catch(() => {
        return res.status(500).send({ message: "internal serveur error" });
      });
  }

  static verifyEmail(req, res) {
    if (!req.params.email || !req.params.code) {
      return res.status(403).json({
        message: "This is not a valid account, or was previously update",
      });
    }

    const email = req.params.email.trim();
    const code = req.params.code;

    User.findOneAndUpdate(
      { email, isEmailVerifiedToken: code },
      {
        isActive: true,
        isEmailVerified: true,
        isEmailVerifiedToken: null,
      },
      { new: true }
    )
      .then((docUser) => {
        if (!docUser) {
          res.status(403).json({
            message: "This is not a valid account, or was previously updated",
          });
        } else {
          res.json({
            message:
              "Your account was succesfully verified, you will be redirect",
            token: generateToken(docUser),
          });
        }
      })
      .catch(() => res.status(500).sennd({ message: "Internal server error" }));
  }

  static getMe(req, res) {
    const psw = req.headers["x-pass"];
    User.findOne({ email: req.params.email })

      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: "We did not find your account" });
        }

        if (psw && psw !== "undefined" && !user.validPassword(psw)) {
          return res.status(403).send({ message: "Wrong password" });
        }
        //  if (!user.isEmailVerified) { return res.status(403).send({ message: 'Plz verifie your email first' }) }
        //  if (!user.isActive) { return res.status(403).send({ message: 'account not acctivate' }) }

        const token = generateToken(user);

        return res.json({ token }); /* istanbul ignore next */
      })
      .catch(() => {
        return res.status(500).send({ message: "Internal serveur error" });
      });
  }

  static updatePublic(req, res) {
    const params = filter(req.body, updateParamsPublic);
    if (params.email) {
      User.findOne({ email: params.email }).then((u) => {
        if (u) {
          return res.status(401).send({ message: "This email is already use" });
        }
        User.findOneAndUpdate(
          { _id: req.params.id },
          { $set: params },
          { new: true }
        )
          .then((user) => {
            if (!user) {
              return res
                .status(404)
                .send({ message: "We didn't find any user" });
            }
            const token = generateToken(user);
            return res.json({ token });
          })
          .catch(() => {
            return res.status(500).send({ message: "Internal server error" });
          });
      });
    } else {
      User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: params },
        { new: true }
      )
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: "We didn't find any user" });
          }
          const token = generateToken(user);
          return res.json({ token });
        })
        .catch(() => {
          return res.status(500).send({ message: "Internal server error" });
        });
    }
  }

  static updatePrivate(req, res) {
    const params = filter(req.body, updateParamsPrivate);
    const paramsToUpdate = {};

    User.findOne({ email: params.email })
      .then((uTmp) => {
        if (uTmp) {
          return res.status(401).send({ message: "This is email is used" });
        }

        if (params.password) {
          paramsToUpdate.password = bcrypt.hashSync(params.password, 10);
        }
        if (params.email) {
          paramsToUpdate.email = params.email;
        }
        User.findOneAndUpdate(
          { _id: req.params.id },
          { $set: paramsToUpdate },
          { new: true }
        ).then((user) => {
          const token = generateToken(user);
          return res.json({
            message: "Private information has been updated successfully",
            token,
          });
        });
      })
      .catch(() => {
        return res.status(500).send({ message: "Internal server error" });
      });
  }

  static addFriend(req, res) {
    User.findOne({ _id: req.params.userId }).then((u) => {
      if (!u) {
        return res.status(404).send({ message: "We did not find any User" });
      }

      User.findOne({ email: req.params.email }).then((is) => {
        if (!is) {
          return res.status(404).send({ message: "We did not find any User" });
        }
        const index = u.friends.findIndex((e) => e === req.params.email);
        if (index !== -1) {
          return res
            .status(401)
            .send({ message: "You can add 2 time the same user" });
        }
        const params = { friends: u.friends || [] };
        params.friends.push(req.params.email);
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: params },
          { new: true }
        )
          .then((user) => {
            if (!user) {
              return res
                .status(404)
                .send({ message: "We did not find any User" });
            }
            const token = generateToken(user);
            return res.json({ token });
          })
          .catch(() => {
            return res.status(500).send({ message: "Internal serveur error" });
          });
      });
    });
  }

  static facebookLink(req, res) {
    if (
      req.body !== null &&
      req.body.accessToken !== null &&
      req.body.accessToken.toString() !== ""
    ) {
      FB.setAccessToken(req.body.accessToken.toString());
      FB.api(
        "me",
        {
          fields: "id,name,email,first_name,last_name",
          access_token: req.body.accessToken.toString(),
        },
        (fbRes) => {
          User.findOne({ _id: req.params.id })
            .then((u) => {
              if (u) {
                const toSave = {
                  url: fbRes.url,
                  firstName: fbRes.first_name,
                  lastName: fbRes.last_name,
                  isFaceBookLogin: true,
                };
                User.findByIdAndUpdate(
                  {
                    _id: req.params.id,
                  },
                  { $set: toSave },
                  { new: true }
                ).then((user) => {
                  const token = generateToken(user);
                  return res.json({ token });
                });
              } else {
                return res
                  .status(403)
                  .send({ message: "Can't find your account" });
              }
            })
            .catch(() => {
              return res.status(500).send({ message: "Internal server error" });
            });
        }
      );
    } else {
      return res.status(401).send({ message: "your token is not valid" });
    }
  }

  static facebookCreate(req, res) {
    if (
      req.body !== null &&
      req.body.accessToken !== null &&
      req.body.accessToken.toString() !== ""
    ) {
      FB.setAccessToken(req.body.accessToken.toString());

      FB.api(
        "me",
        {
          fields: "id,name,email,first_name,last_name",
          access_token: req.body.accessToken.toString(),
        },
        (fbRes) => {
          if (fbRes.email === undefined) {
            res.status(402).send({
              message: "There is a problem with Fb Api, try again later...",
            });
          }
          User.findOne({ email: fbRes.email })
            .then((u) => {
              if (u) {
                if (u.isFaceBookLogin === true) {
                  const token = generateToken(u);
                  return res.json({ token });
                }
                return res
                  .status(403)
                  .send({ message: "This email is already used" });
              }
              const user = new User({
                email: fbRes.email,
                isActive: true,
                url: fbRes.url,
                firstName: fbRes.first_name,
                lastName: fbRes.last_name,
                isEmailVerified: true,
                isFacebookLogin: true,
              });

              user.save((err) => {
                if (err) {
                  return res
                    .status(500)
                    .send({ message: "Internal server error" });
                }
                const token = generateToken(user);
                return res.json({ token });
              });
            })
            .catch(() => {
              return res.status(500).send({ message: "Internal server error" });
            });
        }
      );
    } else {
      return res.status(401).send({ message: "Your token is invalid" });
    }
  }

  static resetPassword(req, res) {
    User.findOne({ email: req.params.email }).then((u) => {
      if (!u) {
        return res.status(404).send({ message: "this account doesn't exist" });
      }
      const email = req.params.email;
      const tokenStr = createCode();
      send("noreply@musicroom.tqt", email, "Reset password:", {
        code: tokenStr,
        name: u.firstName,
      });
      User.findOneAndUpdate(
        { email },
        { $set: { isPasswordReset: true, passwordResetCode: tokenStr } }
      ).then(() => {
        res.json({ message: "email send" });
      });
    });
  }
}
