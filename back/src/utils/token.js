import jwt from "jsonwebtoken";

import config from "../../config";

export const JWT_SECRET = config.local.jwtSecret;

export const generateToken = (user) => {
  const u = {
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    id: user._id,
    musicTags: user.musicTags,
    isPrivateInfo: user.isPrivateInfo,
    isActive: user.isActive,
    isFaceBookLogin: user.isFaceBookLogin,
    friends: user.friends,
  };
  let expiresIn = 60 * 60 * 24; // 24h
  return jwt.sign(u, JWT_SECRET, {
    expiresIn,
  });
};
