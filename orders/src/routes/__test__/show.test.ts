import request from "supertest";
import { buildTicket } from "./utils";
import { app } from "../../app";

it("fetches the order", async () => {
  const ticket = await buildTicket();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  const ticket = await buildTicket();

  const user1 = global.signin("1");
  const user2 = global.signin("2");

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).get(`/api/orders/${order.id}`).set("Cookie", user2).send().expect(401);
});
