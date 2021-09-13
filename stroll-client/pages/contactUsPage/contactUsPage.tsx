import React from "react";

import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

interface ProfilePageProps {
  
}

export const ContactUsPage: React.FC<ProfilePageProps> = (props: ProfilePageProps) => {
  return(
    <Page id="contact-us-page" backgroundGraphic="" showFooter>    
      <PageTitle text="Contact Us" />
      <div className="contact-us-section">
        <a className="contact-us-email passion-one-font" href = "mailto:feedback@strollthedice.com">feedback@strollthedice.com</a>
        <p className="contact-us-info-statement passion-one-font">
          For any feedback or suggestions you might have.
        </p>
      </div>
      <div className="contact-us-section">
        <a className="contact-us-email passion-one-font" href = "mailto:contact@strollthedice.com">contact@strollthedice.com</a>
        <p className="contact-us-info-statement passion-one-font">For assistance with anything or questions you might have.</p>
      </div>
      <div className="contact-us-section">
        <p className="contact-us-info-statement passion-one-font">
          While we will do our best to get back to you as quickly as possible, please allow 24 - 48 business hours for a response, if necessary.
        </p>
        <p className="contact-us-info-statement passion-one-font">
          Thanks, hope you have a great rest of your day!
        </p>
      </div>
    </Page>
  )
}