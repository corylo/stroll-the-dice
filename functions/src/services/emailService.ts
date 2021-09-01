import { https, logger } from "firebase-functions";

import mailchimpTransactional from "@mailchimp/mailchimp_transactional";

import { MailChimpApiKey } from "../../../config/mailChimpApiKey";

import { EmailUtility } from "../utilities/emailUtility";

import { IMailchimpSendTemplateCustomRequest } from "../models/mailchimp/mailchimpSendTemplateRequest";

import { EmailTemplate } from "../enums/emailTemplate";

const Mailchimp: any = mailchimpTransactional(MailChimpApiKey.Value);

interface IEmailService {
  sendDayCompleteEmail: (gameID: string, gameName: string, day: number, duration: number, emails: string[]) => Promise<void>;
  sendGameStartedEmail: (gameID: string, gameName: string, emails: string[]) => Promise<void>;
  sendEmail: (request: IMailchimpSendTemplateCustomRequest, emails: string[]) => Promise<void>;
}

export const EmailService: IEmailService = {
  sendDayCompleteEmail: async (gameID: string, gameName: string, day: number, duration: number, emails: string[]): Promise<void> => {
    const request: IMailchimpSendTemplateCustomRequest = {
      template_name: EmailTemplate.DayComplete,
      message: {
        subject: `Day ${day} of ${gameName} is complete!`,            
        global_merge_vars: [
          { name: "game", content: gameName },
          { name: "today", content: day },
          { name: "tomorrow", content: day + 1 },
          { name: "duration", content: duration },
          { name: "gameid", content: gameID }
        ]
      }
    }

    await EmailService.sendEmail(request, emails);
  },
  sendGameStartedEmail: async (gameID: string, gameName: string, emails: string[]): Promise<void> => {
    const request: IMailchimpSendTemplateCustomRequest = {
      template_name: EmailTemplate.GameStarted,
      message: {
        subject: `${gameName} has started!`,            
        global_merge_vars: [
          { name: "game", content: gameName },
          { name: "gameid", content: gameID }
        ]
      }
    }

    await EmailService.sendEmail(request, emails);
  },
  sendEmail: async (request: IMailchimpSendTemplateCustomRequest, emails: string[]): Promise<void> => {
    await Mailchimp.messages.sendTemplate(EmailUtility.mapEmailRequest(request, emails));
  }
}