import { Publisher, OrderCreatedEvent, Subjects } from "@rticketing/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
