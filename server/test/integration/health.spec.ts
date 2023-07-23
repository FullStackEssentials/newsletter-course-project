import request from "supertest";
import HttpStatus from "http-status";
import { createServer } from "../../src/server";
import { PrismaClient } from "@prisma/client";
import { TestPubSub } from "../../src/services/pubsub/test-pubsub";
import TestMailer from "../../src/services/mailer/test-mailer";

describe("health", () => {
  const prisma = new PrismaClient();
  const pubSub = new TestPubSub();
  const mailer = new TestMailer();
  const server = createServer({ prisma, pubSub, mailer }).listen(80);

  afterAll(async () => {
    server.close();
  });

  it("should return 200 if the server is up", async () => {
    await request(server)
      .get("/v1/health")
      .send()
      .expect("ok")
      .expect(HttpStatus.OK);
  });
});
