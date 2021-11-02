import mongoose from "mongoose";
import { OrderStatus } from "@povertay/common";
import { TicketDoc } from "./ticket.doc";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

export interface OrderDoc extends mongoose.Document, OrderAttrs {
  version: number;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {
  build(orderAttrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema<OrderAttrs, OrderModel>(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket"
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
  return new Order(attrs);
});

export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
