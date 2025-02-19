import React from 'react';
import { FacebookIcon } from 'lucide-react'; // Changed to FacebookIcon
import '../../../css/styles/landing/Footerlanding.css';

const Footer = () => {
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="contact-info">
            <div className="contact-item">
              <div className="icon-wrapper">
                <svg viewBox="0 0 24 24" className="contact-icon">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <p>NRCP DOST</p>
            </div>
            <p className="address-subtext">Taguig, DOST</p>
            
            <div className="contact-item">
              <div className="icon-wrapper">
                <svg viewBox="0 0 24 24" className="contact-icon">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <a href="mailto:eqmsdostnrcp@company.com" className="email-link">
                dostnrcpeqms@company.com
              </a>
            </div>
            
            <div className="contact-item">
              <div className="icon-wrapper">
                <svg viewBox="0 0 24 24" className="contact-icon">
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7z" />
                </svg>
              </div>
              <p>+123 123 123</p>
            </div>
          </div>
          
          <div className="company-info">
            <h2 className="company-title">About the company</h2>
            <p className="company-description">
            The National Research Council of the Philippines (NRCP) promotes and supports 
            fundamental or basic research for the continuing total improvement of the research capability of 
            individual scientists or group of scientists; provides advice on problems and issues of national interest; promotes scientific and technologica
            </p>
            <div className="social-links">
              <a 
                href="https://www.facebook.com/nationalresearchcouncil/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="facebook-link"
              >
                <FacebookIcon size={24} className="facebook-icon" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;