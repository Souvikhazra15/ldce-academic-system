import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHeadset, faInfo, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Content */}
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">
              <FontAwesomeIcon icon={faBook} /> About Portal
            </h4>
            <p className="footer-description">
              Faculty Portal - A comprehensive platform for managing courses, assessments, and NBA compliance reporting.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#help">Help & Support</a></li>
              <li><a href="#documentation">Documentation</a></li>
              <li><a href="#guidelines">Guidelines</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">
              <FontAwesomeIcon icon={faHeadset} /> Support
            </h4>
            <ul className="footer-links">
              <li>
                <FontAwesomeIcon icon={faEnvelope} className="footer-icon" />
                <a href="mailto:support@ldce.ac.in">support@ldce.ac.in</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faInfo} className="footer-icon" />
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2024 LDCE. All rights reserved. | NBA Accreditation Support System
            </p>
            <div className="footer-policies">
              <a href="#privacy">Privacy Policy</a>
              <span className="footer-separator">•</span>
              <a href="#terms">Terms of Service</a>
              <span className="footer-separator">•</span>
              <a href="#accessibility">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
