import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
import { OrderStatus } from "@rticketing/common"
import { TicketDoc } from "./ticket"

// An interface that desdribes the properties that are required to create a new Ticket
interface OrderAttrs {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: mongoose.HydratedDocument<TicketDoc>
}

interface OrderDoc extends OrderAttrs {
  version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): mongoose.HydratedDocument<OrderDoc>
}

const OrderSchema = new mongoose.Schema<OrderAttrs>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

OrderSchema.set("versionKey", "version")
OrderSchema.plugin(updateIfCurrentPlugin)

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}
OrderSchema.index({ userId: 1 })

const Order = mongoose.model<OrderAttrs, OrderModel>("User", OrderSchema)

// const Order = Order.build({
//   title: "title",
//   price: 20,
//   userId: '12341234'
// })

export { Order, OrderStatus }
