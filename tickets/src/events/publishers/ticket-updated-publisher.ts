import { Publisher, Subjects, TicketUpdatedEvent } from "@povertay/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
