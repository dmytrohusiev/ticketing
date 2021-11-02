import { Listener, OrderCreatedEvent, Subjects } from "@povertay/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      price: data.ticket.price,
      status: data.status,
      version: data.version
    });

    await order.save();

    msg.ack();
  }
}
