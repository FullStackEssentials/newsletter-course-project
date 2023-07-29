import express from "express";
import { signupHandler } from "./signup";
import { PrismaClient } from "@prisma/client";
import { PubSubService } from "../../services/pubsub/types";
import { sendConfirmEmailHandler } from "./send-confirm-email";
import { MailerService } from "../../services/mailer/types";
import { confirmEmailHandler } from "./confirm-email";
import { sendWelcomeEmailHandler } from "./send-welcome-email";

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
  newsletterRouter.post(
    "/newsletter/confirm-email",
    confirmEmailHandler(prisma, pubSub)
  );
  newsletterRouter.post(
    "/newsletter/send-welcome-email",
    sendWelcomeEmailHandler(mailer)
  );

  return newsletterRouter;
};
