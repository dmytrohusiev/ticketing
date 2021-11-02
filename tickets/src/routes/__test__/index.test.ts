import request from "supertest";
import { app } from "../../app";

const config = [
  { title: "asdasd", price: 20 },
  { title: "fdfdsdsdf", price: 15 },
  { title: "zxczxc", price: 50 }
];

it("can fetch a list of tickets", async () => {
  await Promise.all(
    config.map(
      async item => await request(app).post("/api/tickets").set("Cookie", global.signin()).send(item).expect(201)
    )
  );

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
