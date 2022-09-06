import request from "supertest"
import { app } from "../../app"

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201)
})

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com", // Invalid email
      password: "password",
    })
    .expect(400)
})

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: "p", // Invalid password
    })
    .expect(400)
})

it("returns a 400 with missing mail and password password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "email@email.com", // Missing password
    })
    .expect(400)

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "12345", // Missing email
    })
    .expect(400)

  await request(app)
    .post("/api/users/signup")
    .send({
      // Missing email and password
    })
    .expect(400)
})

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201)

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400)
})

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201)

  expect(response.get("Set-Cookie")).toBeDefined()
})
