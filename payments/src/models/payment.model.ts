import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}
interface PaymentDoc extends mongoose.Document, PaymentAttrs {}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema<PaymentDoc, PaymentModel>(
  {
    orderId: {
      type: String,
      required: true
    },
    stripeId: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

export const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema);
