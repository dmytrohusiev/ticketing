import { Publisher, Subjects, OrderCreatedEvent } from "@povertay/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
