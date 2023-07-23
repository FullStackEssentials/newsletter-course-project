export interface SendConfirmEmailPayload {
  email?: string;
  token?: string;
}

export interface SendWelcomeEmailPayload {
  email: string;
}

export interface MailerService {
  sendConfirmationEmail(payload: SendConfirmEmailPayload): Promise<void>;
  sendWelcomeEmail(payload: SendWelcomeEmailPayload): Promise<void>;
}
