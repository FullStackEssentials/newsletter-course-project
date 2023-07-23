import express from "express";
import { signupHandler } from "./signup";
import { PrismaClient } from "@prisma/client";
import { PubSubService } from "../../services/pubsub/types";
import { sendConfirmEmailHandler } from "./send-confirm-email";
import { MailerService } from "../../services/mailer/types";

export const createNewsletterRouter = (
  prisma: PrismaClient,
  pubSub: PubSubService,
  mailer: MailerService
) => {
  const newsletterRouter = express.Router();

  newsletterRouter.post("/newsletter/signup", signupHandler(prisma, pubSub));
  newsletterRouter.post(
    "/newsletter/send-confirm-email",
    sendConfirmEmailHandler(mailer)
  );

  return newsletterRouter;
};
