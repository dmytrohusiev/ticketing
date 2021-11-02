import { PaymentCreatedEvent, Publisher, Subjects } from "@povertay/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
