import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  salt: String,
});

const userModel = mongoose.model("users", userSchema);

export { userModel, userSchema };
