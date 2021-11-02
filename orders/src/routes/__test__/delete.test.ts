import request from "supertest";
import { buildTicket } from "./utils";
import { app } from "../../app";
import { OrderStatus } from "@povertay/common";
import { Order } from "../../models/order.model";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled", async () => {
  const ticket = await buildTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).delete(`/api/orders/${order.id}`).set("Cookie", global.signin()).send().expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  const ticket = await buildTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).delete(`/api/orders/${order.id}`).set("Cookie", global.signin()).send().expect(204);
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
