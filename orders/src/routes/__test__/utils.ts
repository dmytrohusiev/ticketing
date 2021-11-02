import { Ticket } from "../../models/ticket.model";
import mongoose from "mongoose";

export const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20
  });

  await ticket.save();

  return ticket;
};
