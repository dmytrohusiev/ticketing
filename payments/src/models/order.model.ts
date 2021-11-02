import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@povertay/common";

export interface OrderAttrs {
  id: string;
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
}

export interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {
  build(orderAttrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema<OrderDoc, OrderModel>(
  {
    userId: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.static("build", function build(attrs: OrderAttrs) {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status
  });
});

export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
