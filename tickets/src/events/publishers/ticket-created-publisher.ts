import { Publisher, Subjects, TicketCreatedEvent } from "@rticketing/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
