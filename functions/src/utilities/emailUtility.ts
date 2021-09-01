import { IMailchimpMergeVariable, IMailchimpMessageTo, IMailchimpSendTemplateCustomRequest, IMailchimpSendTemplateRequest } from "../models/mailchimp/mailchimpSendTemplateRequest";

interface IEmailUtility {
  getCompanyValues: () => IMailchimpMergeVariable[];
  mapEmailRequest: (customRequest: IMailchimpSendTemplateCustomRequest, emails: string[]) => IMailchimpSendTemplateRequest;
  mapRecipients: (emails: string[]) => IMailchimpMessageTo[];
}

export const EmailUtility: IEmailUtility = {
  getCompanyValues: (): IMailchimpMergeVariable[] => {
    const year: string = new Date().getFullYear().toString();

    return [
      { name: "year", content: year },
      { name: "company", content: "Waff Apps LLC" },
      { name: "address", content: "12220 N MacArthur Blvd Ste F # 701 Oklahoma City, OK 73162" }
    ]
  },
  mapEmailRequest: (request: IMailchimpSendTemplateCustomRequest, emails: string[]): IMailchimpSendTemplateRequest => {
    return {
      message: {
        from_email: request.message.from_email || "notifications@strollthedice.com",
        from_name: request.message.from_name || "Stroll The Dice",
        global_merge_vars: [
          ...EmailUtility.getCompanyValues(),
          ...request.message.global_merge_vars
        ],
        merge_language: "handlebars",
        subject: request.message.subject,
        to: EmailUtility.mapRecipients(emails)
      },
      template_content: [{}],
      template_name: request.template_name
    };
  },
  mapRecipients: (emails: string[]): IMailchimpMessageTo[] => {
    return emails.map((email: string) => ({ email, type: "to" }));
  }
}