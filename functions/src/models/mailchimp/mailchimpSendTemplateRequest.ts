import { EmailTemplate } from "../../enums/emailTemplate";

export interface IMailchimpMergeVariable {
  content: string | number;
  name: string;
}

export interface IMailchimpMessageTo {
  email: string;
  type: "to"
}

export interface IMailchimpMessage {
  from_email: string;
  from_name: string;
  global_merge_vars: IMailchimpMergeVariable[];
  merge_language: "handlebars";
  subject: string;
  to: IMailchimpMessageTo[];
}

export interface IMailchimpSendTemplateRequest {
  message: IMailchimpMessage;
  template_content: any[];
  template_name: EmailTemplate;
}

export interface IMailchimpCustomMessage {
  from_email?: string;
  from_name?: string;
  global_merge_vars: IMailchimpMergeVariable[];  
  subject: string;
}

export interface IMailchimpSendTemplateCustomRequest {
  message: IMailchimpCustomMessage;  
  template_name: EmailTemplate;
}