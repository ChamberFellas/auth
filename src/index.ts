import express from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes";
import mongoose from "mongoose";

export const app = express();

app.use(express.json());

app.use(router);

if (process.env.NODE_ENV !== "test") {
  if (!process.env.PORT) {
    console.error("PORT is not defined");
    console.log("Setting port to default: 3000");
  }

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined");
    console.log("Setting MONGO_URI to default: mongodb://localhost:27017/auth");
  }
  const PORT = process.env.PORT || 3000;
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/auth";

  mongoose.connect(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
