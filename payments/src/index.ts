import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";
import { config } from "./config";
import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  try {
    await natsWrapper.connect(config.nats.cluster_id, config.nats.client_id, config.nats.uri);

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(config.mongo_uri);
    console.log("Connected to mongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening for port 3000!");
  });
};

start().catch();
