// src/types/mailgun-js.d.ts
declare module 'mailgun-js' {
    interface MailgunMessage {
      from: string;
      to: string | string[];
      subject: string;
      text?: string;
      html?: string;
      [key: string]: unknown;
    }
  
    interface MailgunClientOptions {
      apiKey: string;
      domain: string;
      host?: string;
    }
  
    interface Messages {
      send(data: MailgunMessage): Promise<unknown>;
    }
  
    interface MailgunClient {
      messages(): Messages;
    }
  
    function mailgun(options: MailgunClientOptions): MailgunClient;
    export = mailgun;
  }