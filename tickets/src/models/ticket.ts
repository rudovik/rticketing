import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

// An interface that desdribes the properties that are required to create a new Ticket
interface TicketAttrs {
  title: string
  price: string
  userId: string
  orderId?: string
}

interface TicketDoc extends TicketAttrs {
  version: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): mongoose.HydratedDocument<TicketDoc>
}

const ticketSchema = new mongoose.Schema<TicketAttrs>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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
ticketSchema.set("versionKey", "version")
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}
ticketSchema.index({ userId: 1 })

const Ticket = mongoose.model<TicketAttrs, TicketModel>("Ticket", ticketSchema)

// const ticket = Ticket.build({
//   title: "title",
//   price: 20,
//   userId: '12341234'
// })

export { Ticket }
