import sendGrid from "@sendgrid/mail";
import {
  MailerService,
  SendConfirmEmailPayload,
  SendWelcomeEmailPayload,
} from "./types";
import { APP_URL } from "../../utils/constants";

interface SendGridServiceConfig {
  /** Private key from SendGrid that connects to our account */
  apiKey: string;
  /** Sender of the newsletter service emails */
  sender: string;
}

export class SendGridService implements MailerService {
  private readonly sender: string;

  constructor({ sender, apiKey }: SendGridServiceConfig) {
    sendGrid.setApiKey(apiKey);
    this.sender = sender;
  }
  async sendWelcomeEmail({ email }: SendWelcomeEmailPayload): Promise<void> {
    const templateId = process.env.SENDGRID_WELCOME_EMAIL_TEMPLATED_ID || "";

    console.log("SendGridService::sendWelcomeEmail: Sending email template");

    await sendGrid.send({
      subject: "Welcome email",
      templateId,
      from: this.sender,
      to: email,
    });
  }

  async sendConfirmationEmail({ email, token }: SendConfirmEmailPayload) {
    const link = `${APP_URL}/confirm-email?token=${token}&email=${email}`;
    const templateId = process.env.SENDGRID_CONFIRM_EMAIL_TEMPLATED_ID || "";

    console.log(
      "SendGridService::sendConfirmEmailTemplate: Sending email template"
    );

    await sendGrid.send({
      subject: "Confirmation Email",
      templateId,
      from: this.sender,
      to: email,
      dynamicTemplateData: {
        link,
      },
    });
  }
}
