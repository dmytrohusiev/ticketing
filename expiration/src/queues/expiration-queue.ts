import Queue from "bull";
import { config } from "../config";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: { host: config.redis.host }
});

expirationQueue.process(async job => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({ orderId: job.data.orderId });
});
