import request from "supertest";
import HttpStatus from "http-status";
import { createServer } from "../../src/server";
import { PrismaClient } from "@prisma/client";
import { TestPubSub } from "../../src/services/pubsub/test-pubsub";
import TestMailer from "../../src/services/mailer/test-mailer";

describe("signup", () => {
  const prisma = new PrismaClient();
  const pubSub = new TestPubSub();
  const mailer = new TestMailer();
  const server = createServer({ prisma, pubSub, mailer }).listen(80);

  afterAll(async () => {
    server.close();

    // cleanup whole database after its finished
    await prisma.newsletterSubscriber.deleteMany();

    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // cleanup
    await prisma.newsletterSubscriber.deleteMany();
  });

  it("should throw 400 if not sent an email in the body", async () => {
    await request(server)
      .post("/v1/newsletter/signup")
      .send()
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("should return 400 if the email is invalid", async () => {
    const email = "integration-test@.com";

    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("should not fail if the email is already signed up, it should upsert", async () => {
    const email = "integration-test@mail.com";

    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.CREATED);

    const first = await prisma.newsletterSubscriber.findFirst({
      where: { email },
    });

    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.CREATED);

    const second = await prisma.newsletterSubscriber.findFirst({
      where: { email },
    });

    const hasNewToken = first?.token !== second?.token;
    expect(hasNewToken).toBeTruthy();
  });

  it("should return 201 if an valid email is sent", async () => {
    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email: "valid@mail.com" })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.CREATED);
  });
});
