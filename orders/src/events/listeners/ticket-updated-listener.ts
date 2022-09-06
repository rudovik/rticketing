import { Message } from "node-nats-streaming"
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  TicketCreatedEvent,
} from "@rticketing/common"
import { Ticket } from "../../models/ticket"
import { queueGroupName } from "./queue-group-name"

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data
    const ticket = await Ticket.findByEvent(data)

    if (!ticket) {
      throw new Error("Ticket not found")
    }

    ticket.set({ title, price })
    await ticket.save()

    msg.ack()
  }
}
