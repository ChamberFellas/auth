import { Router } from "express";
import { authenticateToken, generateAccessToken } from "./auth";
import { userModel } from "./models/model";
import bcrypt from "bcrypt";

const router = Router();

router.get("/status", (_, res) => {
  res.status(200).json({ status: "OK" });
});

router.post("/auth/internal/validate", async (req, res) => {
  const { token } = req.body;

  try {
    authenticateToken(token, res);
    return;
  } catch (error) {
    res.status(500).send({ error: "Something went wrong with the validation" });
  }
});

//token refreshing
/*
.post('/auth/internal/refresh',(req,res) => {
    const {testToken} = req.body;


    const newToken = 'ABcD';// this is a tempoary string showing a example new token
    const validRefreshToken = '1234';// this is a tempoary string showing a valid token so i can check everything works before linking it to the databas/ implementing jwt

    if (!refresh_token) {
        return res.status(400).send({ error: "No refresh token provided" });
    }

    if (refresh_token === validRefreshToken) {
        return res.status(200).send({
            access_token: "newAccessToken123",
            refresh_token: "newRefreshToken456",
        });
    }

    res.status(401).send({ error: "Invalid or expired refresh token" })


});
*/

//registering a new user
router.post("/auth/register", async (req, res) => {
  //I had to label this async to give the hash enough time to compute
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(418).send({
      error: "you didnt send all the data silly!",
    });
  } else {
    //need to check username doesnt exist in db already

    try {
      // Check if the user already exists in the database
      const existingUser = await userModel.findOne({ username });

      if (existingUser) {
        res
          .status(409)
          .send({ error: "Username already taken. Choose another one!" });
        return;
      } else {
        const salt = await bcrypt.genSalt(15); // we need the await as the hashing takes a while(to help protect against brute force) 2^N(15 at moment)
        // 15 was said to be a good level of work on this video:   https://www.youtube.com/watch?v=qgpsIBLvrGY  but i may deecrease it as its running a bit TOO slow
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
          username: username,
          password: hashedPassword,
          salt: salt,
        });
        await newUser.save(); // Save the user to MongoDB
        res.status(201).send({
          message: "User successfully registered!",
          username: username,
        });
        return;
      }
    } catch (error) {
      res.status(500).send({ error: "Something went wrong with hashing!" });
      return;
    }
  }
});

//loging in a user
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  //find the entry in the database with the username, than get the slat and the password
  const user = await userModel.findOne({ username }); //im using === rather than == as == would treat '123' and 123 as equal which i dont want

  if (!user || !user.password) {
    res.status(401).send({ error: "account not recognised" }); //
    return;
  } else if (await bcrypt.compare(password, user.password)) {
    const accessToken = generateAccessToken(username);
    //const refreshToken = generateRefreshToken(username);

    res.status(200).send({
      access_token: accessToken,
      //refresh_token: refreshToken,
    });
  } else {
    res.status(401).send({ error: "Invalid username or password" });
    return;
  }
});

router.post("/auth/update", async (req, res) => {
  const { token, oldPassword, newPassword } = req.body;

  const decodedToken = authenticateToken(token, res);
  if (!decodedToken) {
    return;
  }

  const user = await userModel.findOne({ username: decodedToken.username });
  if (user && user.password) {
    if (await bcrypt.compare(oldPassword, user.password)) {
      const salt = await bcrypt.genSalt(15);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      user.salt = salt;

      res.status(200).send({
        message:
          "you succesfully updated the account password associated with that token ",
        userID_UPDATED: decodedToken.username,
      });
    } else {
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }
  }
  res.status(404).send({ error: "User not found" });
  return;
});

router.post("/auth/delete", async (req, res) => {
  const { token, hashedPassword } = req.body;

  const decodedToken = authenticateToken(token, res);
  if (!decodedToken) {
    return;
  }

  const user = await userModel.findOne({ username: decodedToken.username });
  if (user && user.password) {
    if (await bcrypt.compare(hashedPassword, user.password)) {
      await userModel.deleteOne({ username: decodedToken.username });
      res.status(200).send({
        message:
          "You successfully deleted the account associated with that token.",
        userID_DELETED: decodedToken.username,
      });
    } else {
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }
  }
  res.status(404).send({ error: "User not found" });
  return;
});

export default router;
