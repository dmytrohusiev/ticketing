import mongoose from "mongoose";
import { Order } from "./order.model";
import { OrderStatus } from "@povertay/common";
import { TicketAttrs, TicketDoc, TicketModel } from "./ticket.doc";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.static("build", function build(attrs: TicketAttrs) {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  });
});
ticketSchema.static("findByEvent", function findByEvent(event: { id: string; version: number }) {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
});

ticketSchema.methods.isReserved = async function isReserved() {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete]
    }
  });

  return !!existingOrder;
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);
