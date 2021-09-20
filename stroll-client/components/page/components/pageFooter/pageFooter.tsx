import React from "react";
import { Link } from "react-router-dom";

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
      <div className="page-footer-rights-statement">
        <h1 className="passion-one-font">{new Date().getFullYear()} Waff Apps LLC. All rights reserved.</h1>
      </div>
    </div>
  );
}