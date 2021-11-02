import mongoose from "mongoose";

export interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

export interface TicketModel extends mongoose.Model<TicketDoc> {
  build(orderAttrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}
