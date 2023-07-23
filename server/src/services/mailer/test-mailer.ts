import {
  MailerService,
  SendConfirmEmailPayload,
  SendWelcomeEmailPayload,
} from "./types";

export default class TestMailer implements MailerService {
  async sendWelcomeEmail(payload: SendWelcomeEmailPayload): Promise<void> {
    console.log("Sending welcome email...");
    console.log(payload);
    console.log("Fake welcome has been sent!");
  }
  async sendConfirmationEmail(payload: SendConfirmEmailPayload): Promise<void> {
    console.log("Sending fake email...");
    console.log(payload);
    console.log("Fake email has been sent!");
  }
}
