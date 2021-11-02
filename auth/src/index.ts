import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";
import { config } from "./config";

const start = async () => {
  try {
    await mongoose.connect(config.mongo_uri);
    console.log("Connected to mongoDB.");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening for port 3000!");
  });
};

start().catch();
