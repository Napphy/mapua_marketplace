import React from 'react';
import './Footer.css'; // Import your CSS file

const Footer = () => {
  return (
    <div className="footer">
      <marquee className="donate-banner" direction="left" scrollamount="11">
        Please consider donating to keep the site running
      </marquee>
    </div>
  );
};

export default Footer;
