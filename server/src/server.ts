import express, { Express, Response, Request } from "express";
import { createHealthRouter } from "./routes/health";
import { createNewsletterRouter } from "./routes/newsletter";
import { PrismaClient } from "@prisma/client";
import { PubSubService } from "./services/pubsub/types";
import { MailerService } from "./services/mailer/types";

interface CreateServerParams {
  prisma: PrismaClient;
  pubSub: PubSubService;
  mailer: MailerService;
}

const errorHandler = (error: Error, req: Request, res: Response) => {
  console.log(error);

  res.status(500).json({
    status: false,
    message: error.message || "Internal Server Error",
  });
};

// the server singleton
let server: Express | null = null;

export const createServer = ({
  prisma,
  pubSub,
  mailer,
}: CreateServerParams): Express => {
  if (server) return server;

  server = express();

  // middleware setup
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use("/v1", createHealthRouter());
  server.use("/v1", createNewsletterRouter(prisma, pubSub, mailer));

  server.use((req, res, next) => {
    next(new Error("Not found"));
  });

  server.use(errorHandler);

  return server;
};
