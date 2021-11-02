import { Publisher, Subjects, OrderCancelledEvent } from "@povertay/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
