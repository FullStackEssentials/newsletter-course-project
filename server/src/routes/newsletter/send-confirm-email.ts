import { Request, Response } from "express";
import { isPubSubPayload } from "../../services/pubsub/gcp";
import { ErrorCode } from "../../errors/api-error";
import HttpStatus from "http-status";
import { MailerService } from "../../services/mailer/types";

export const sendConfirmEmailHandler =
  (mailer: MailerService) => async (request: Request, response: Response) => {
    try {
      // 1. Parse PubSub payload
      const { body } = request;

      // 2. Validate
      if (!isPubSubPayload(body)) {
        throw new ErrorCode("ERR-003");
      }

      // 3. Parse message payload
      const {
        message: { data: encodedJsonObject },
      } = body;

      const parsedBuffer = Buffer.from(
        encodedJsonObject as string,
        "base64"
      ).toString("ascii");

      const parsedPayload = JSON.parse(parsedBuffer);

      // 4. Send email
      console.log("sendConfirmEmailHandler: ", parsedPayload);
      await mailer.sendConfirmationEmail(parsedPayload);

      return response.status(HttpStatus.OK).json({ message: "OK" });
    } catch (error: unknown) {
      if (!(error instanceof ErrorCode)) {
        console.error("sendConfirmEmailHandler: ", error);
        throw new Error(String(error));
      }

      if (["ERR-003"].includes(error.code)) {
        return response.status(HttpStatus.BAD_REQUEST).json(error.message);
      }

      throw new Error(String(error));
    }
  };
