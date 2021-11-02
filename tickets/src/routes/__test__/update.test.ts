import request from "supertest";
import { app } from "../../app";
import { Types } from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket.model";

const initialTicket = {
  title: "asdasd",
  price: 20
};

const updatedTicket = {
  title: "asd",
  price: 25
};

it("returns a 404 if the provided ID does not exist", async () => {
  const id = new Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`).set("Cookie", global.signin()).send(initialTicket).expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`).send(initialTicket).expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send(initialTicket)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin("2"))
    .send({ title: "updated", price: 1000 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send(initialTicket)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ ...updatedTicket, title: "" })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ ...updatedTicket, price: -20 })
    .expect(400);
});

it("updates the ticket when provided valid inputs", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send(initialTicket)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send(updatedTicket)
    .expect(200);

  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();

  expect(ticketResponse.body.title).toEqual(updatedTicket.title);
  expect(ticketResponse.body.price).toEqual(updatedTicket.price);
});

it("publishes an event", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send(initialTicket)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send(updatedTicket)
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send(initialTicket)
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send(updatedTicket)
    .expect(400);
});
