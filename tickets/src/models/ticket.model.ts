import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

export interface TicketDoc extends mongoose.Document, TicketAttrs {
  orderId?: string;
  version: number;
  __v: unknown;
}

export interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema<TicketDoc, TicketModel>(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    orderId: {
      type: String
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
  return new Ticket(attrs);
});

export const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);
