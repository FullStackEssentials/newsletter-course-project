import { Request, Response } from "express";
import HttpStatus from "http-status";
import { MailerService } from "../../services/mailer/types";
import { isPubSubPayload } from "../../services/pubsub/gcp";
import { ErrorCode } from "../../errors/api-error";

export const sendWelcomeEmailHandler =
  (mailer: MailerService) => async (request: Request, response: Response) => {
    try {
      const { body } = request;

      if (!isPubSubPayload(body)) {
        throw new ErrorCode("ERR-003");
      }

      const {
        message: { data: encodedJsonObject },
      } = body;

      const parsedBuffer = Buffer.from(
        encodedJsonObject as string,
        "base64"
      ).toString("ascii");
      const parsedPayload = JSON.parse(parsedBuffer);

      await mailer.sendWelcomeEmail(parsedPayload);

      return response.status(HttpStatus.OK).send();
    } catch (error: unknown) {
      if (!(error instanceof ErrorCode)) {
        console.error("sendWelcomeEmailHandler: ", error);
        throw new Error(String(error));
      }

      if (["ERR-003"].includes(error.code)) {
        return response.status(HttpStatus.BAD_REQUEST).json(error.message);
      }

      throw new Error(String(error));
    }
  };
