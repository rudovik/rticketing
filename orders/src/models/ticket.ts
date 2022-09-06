import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
import { Order, OrderStatus } from "./order"

// An interface that desdribes the properties that are required to create a new Ticket
export interface TicketAttrs {
  title: string
  price: string
  id: string
}

export interface TicketDoc extends TicketAttrs {
  isReserved(): Promise<boolean>
  version: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): mongoose.HydratedDocument<TicketDoc>
  findByEvent(event: {
    id: string
    version: number
  }): Promise<mongoose.HydratedDocument<TicketDoc> | null>
}

const TicketSchema = new mongoose.Schema<TicketAttrs>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

TicketSchema.set("versionKey", "version")
TicketSchema.plugin(updateIfCurrentPlugin)

TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}
TicketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  })
}

TicketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })

  return !!existingOrder
}
// TicketSchema.index({ userId: 1 })

const Ticket = mongoose.model<TicketAttrs, TicketModel>("Ticket", TicketSchema)

// const ticket = Ticket.build({
//   id: 'some',
//   title: "title",
//   price: "20",
// })

export { Ticket }
