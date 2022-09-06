import { Publisher, Subjects, TicketUpdatedEvent } from "@rticketing/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
