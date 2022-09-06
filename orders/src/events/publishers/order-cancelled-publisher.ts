import { Subjects, Publisher, OrderCancelledEvent } from "@rticketing/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
