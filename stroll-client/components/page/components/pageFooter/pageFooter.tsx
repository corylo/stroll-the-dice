import React from "react";
import { Link } from "react-router-dom";

import { Button } from "../../../buttons/button";
import { PageFooterSection } from "./pageFooterSection";

interface PageFooterProps {  
  
}

export const PageFooter: React.FC<PageFooterProps> = (props: PageFooterProps) => {  
  return (
    <div className="page-footer">
      <div className="page-footer-sections">
        <PageFooterSection title="Legal">
            <div className="page-footer-link">
              <a className="passion-one-font" href="https://legal.strollthedice.com/privacy-policy" target="_blank">Privacy Policy</a>
            </div>
            <div className="page-footer-link">
              <a className="passion-one-font" href="https://legal.strollthedice.com/terms-and-conditions" target="_blank">Terms & Conditions</a>
            </div>
            <div className="page-footer-link">
              <a className="passion-one-font" href="https://legal.strollthedice.com/cookie-policy" target="_blank">Cookie Policy</a>
            </div>
        </PageFooterSection>
        <PageFooterSection title="Support">
          <div className="page-footer-link">
            <Link className="passion-one-font" to="/contact-us">Contact Us</Link>
          </div>
        </PageFooterSection>
      </div>
      <div className="page-footer-social-links">
        <Button className="page-footer-social-link" url="https://www.facebook.com/StrollTheDice" external newtab>
          <i className="fab fa-facebook-f" />
        </Button>
        <Button className="page-footer-social-link" url="https://twitter.com/strollthedice" external newtab>
          <i className="fab fa-twitter" />
        </Button>
      </div>
      <div className="page-footer-copyright-statement">
        <h1 className="passion-one-font"><i className="far fa-copyright"></i> {new Date().getFullYear()} Stroll The Dice. All rights reserved.</h1>
      </div>
    </div>
  );
}