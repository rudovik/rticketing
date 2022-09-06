import mongoose from "mongoose"

// An interface that desdribes the properties that are required to create a new Ticket
interface PaymentAttrs {
  orderId: string
  stripeId: string
}

// interface that describes the properties that are set by a plugin such as mongoose-update-if-current
interface PaymentDoc extends PaymentAttrs {
  // version?: number
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): mongoose.HydratedDocument<PaymentDoc>
}

const PaymentSchema = new mongoose.Schema<PaymentDoc>(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs)
}
// OrderSchema.index({ userId: 1 })

const Payment = mongoose.model<PaymentAttrs, PaymentModel>(
  "Payment",
  PaymentSchema
)

export { Payment }
