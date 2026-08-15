import React from 'react';
import logoClg from '../assets/logo_clg_black.png';
import govtLogo from '../assets/Govt_Logo.png';

const Header = () => {
  return (
    <header className="college-header">
      {/* College Logo */}
      <img 
        src={logoClg} 
        alt="Government College of Engineering Erode Logo" 
        className="college-logo"
      />

      {/* College Info */}
      <div className="college-info">
        <h1>Government College of Engineering, Erode</h1>
        <h2>Tamil Nadu, India</h2>
        <p>Approved by AICTE | Affiliated to Anna University</p>
      </div>

      {/* TN State Logo */}
      <img 
        src={govtLogo} 
        alt="Tamil Nadu State Emblem" 
        className="college-logo"
      />
    </header>
  );
};

export default Header;
