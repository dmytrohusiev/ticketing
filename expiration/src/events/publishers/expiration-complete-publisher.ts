import { ExpirationCompleteEvent, Publisher, Subjects } from "@povertay/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
