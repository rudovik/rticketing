import {
  Subjects,
  ExpirationCompleteEvent,
  Publisher,
} from "@rticketing/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
