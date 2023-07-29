import { PrismaClient } from "@prisma/client";
import HttpStatus from "http-status";
import { Request, Response } from "express";
import { ErrorCode } from "../../errors/api-error";
import { PubSubService } from "../../services/pubsub/types";
import { isEmailValid } from "../../utils/email";
import { confirmSubscriber } from "../../services/newsletter";

interface ConfirmEmailPayload {
  token?: string;
  email?: string;
}

export const confirmEmailHandler =
  (prisma: PrismaClient, pubSub: PubSubService) =>
  async (request: Request, response: Response) => {
    try {
      // 1. Get the email from the request
      const { email = "", token = "" } = request.body as ConfirmEmailPayload;

      // 2. validate the email
      if (!email) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(new ErrorCode("ERR-003", "email"));
      }
      if (!isEmailValid(email)) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(new ErrorCode("ERR-002", "email"));
      }

      // 3. Validate the token
      if (!token) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(new ErrorCode("ERR-002", "token"));
      }

      // 4. Find and Confirm the subscriber
      await confirmSubscriber(prisma, email, token);

      // 5. Notify pub/sub that the user confirmed the email
      await pubSub.publish("newsletter-email-confirmed", { email });

      return response.status(HttpStatus.OK).send();
    } catch (error: unknown) {
      if (!(error instanceof ErrorCode)) {
        console.error("confirmEmailHandler: ", error);
        throw new Error(String(error));
      }

      if ("ERR-001" === error.code) {
        return response.status(HttpStatus.NOT_FOUND).json(error.message);
      }

      if (["ERR-002", "ERR-003"].includes(error.code)) {
        return response.status(HttpStatus.BAD_REQUEST).json(error.message);
      }

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json("something went wrong");
    }
  };
