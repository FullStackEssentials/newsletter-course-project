import { Request, Response } from "express";
import HttpStatus from "http-status";
import { isEmailValid } from "../../utils/email";
import { PrismaClient } from "@prisma/client";
import { upsertSubscriber } from "../../services/newsletter";
import { ErrorCode } from "../../errors/api-error";
import { PubSubService } from "../../services/pubsub/types";

interface SignupPayload {
  email?: string;
}

export const signupHandler =
  (prisma: PrismaClient, pubSub: PubSubService) =>
  async (request: Request, response: Response) => {
    try {
      // 1. get the email from the request
      const { email = "" } = request.body as SignupPayload;

      // 2. validate the email
      if (!email) {
        throw new ErrorCode("ERR-001", "Email");
      }
      if (!isEmailValid(email)) {
        throw new ErrorCode("ERR-002", "Email");
      }

      // 3. create user newsletter_subscriber document
      const newsletterSubscriber = await upsertSubscriber(prisma, email);

      // 4. publish a notification pub/sub topic
      await pubSub.publish("newsletter-signup", {
        email: newsletterSubscriber.email,
        token: newsletterSubscriber.token,
      });

      console.log("signupHandler: Sign up successful");

      return response.status(HttpStatus.CREATED).json(newsletterSubscriber);
    } catch (error: unknown) {
      if (!(error instanceof ErrorCode)) {
        console.log("signupHandler: ", error);
        throw new Error(String(error));
      }

      if (["ERR-001", "ERR-002"].includes(error.code)) {
        return response.status(HttpStatus.BAD_REQUEST).json(error.message);
      }

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.message);
    }
  };
