import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";
import { config } from "./config";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
  try {
    await natsWrapper.connect(config.nats.cluster_id, config.nats.client_id, config.nats.uri);

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

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
