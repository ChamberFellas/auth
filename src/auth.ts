import jwt from "jsonwebtoken";
import { Response } from "express";
import User from "./types/user";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

// const AuthenticateToken = (token: string) => {
//   return new Promise((resolve, reject) => {
//     if (!token) {
//       reject({ status: 418, error: "you didnt send a token silly!" });
//     } else {
//       jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) {
//           reject({ status: 401, error: "Invalid or expired token" });
//         } else {
//           resolve(user);
//         }
//       });
//     }
//   });
// };

export const authenticateToken = (
  token: string,
  res: Response,
): User | undefined => {
  if (!token) {
    res.status(418).json({ error: "you didnt send a token silly!" });
    return;
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    } else {
      const userObj = user as User;
      res.status(200).json({
        message: "Authentication successful",
        userId: userObj.username,
        ValidToken: true,
      });
    }
  });
};

export const generateAccessToken = (user: User) => {
  return jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  }); //short for testing
};
