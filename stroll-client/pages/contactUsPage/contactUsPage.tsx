import React from "react";

import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

interface ProfilePageProps {
  
}

export const ContactUsPage: React.FC<ProfilePageProps> = (props: ProfilePageProps) => {
  return(
    <Page id="contact-us-page" backgroundGraphic="" showFooter>    
      <PageTitle text="Contact Us" />
      <p className="contact-us-info-statement passion-one-font">
        If you need assistance with something, have feedback to give, or have questions about anything at all,
        please send an email to <a href = "mailto:support@strollthedice.com">support@strollthedice.com</a> and we will do everything we can to assist you.
      </p>
      <p className="contact-us-info-statement passion-one-font">
        While we will do our best to get back to you as quickly as possible, please allow 24 - 48 business hours for a response.
      </p>
      <p className="contact-us-info-statement passion-one-font">
        Thanks, hope you have a great rest of your day!
      </p>
    </Page>
  )
}