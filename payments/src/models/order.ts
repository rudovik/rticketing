import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
import { OrderStatus } from "@rticketing/common"

// An interface that desdribes the properties that are required to create a new Ticket
interface OrderAttrs {
  id: string
  version: number
  userId: string
  price: string
  status: OrderStatus
}

// interface that describes the properties that are set by a plugin such as mongoose-update-if-current
interface OrderDoc extends OrderAttrs {
  // version?: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): mongoose.HydratedDocument<OrderDoc>
}

const OrderSchema = new mongoose.Schema<OrderDoc>(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
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

OrderSchema.set("versionKey", "version")
OrderSchema.plugin(updateIfCurrentPlugin)

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status,
    version: attrs.version,
  })
}
// OrderSchema.index({ userId: 1 })

const Order = mongoose.model<OrderAttrs, OrderModel>("User", OrderSchema)

export { Order }
