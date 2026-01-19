import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = ({ facultyName = "Faculty Name", instituteName = "Institute Name" }) => {
  const handleProfileClick = () => {
    console.log('Profile clicked');
    // Will integrate: navigate to profile page
    // const response = await fetch('/api/faculty/profile')
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-container">
          <FontAwesomeIcon icon={faBook} className="logo-icon" />
        </div>
        <div className="header-text">
          <h1 className="system-name">{instituteName}</h1>
          <p className="faculty-name">Welcome, {facultyName}</p>
        </div>
      </div>
      <div className="header-right">
        <button 
          className="profile-icon" 
          title="Profile"
          onClick={handleProfileClick}
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </header>
  );
};

export default Header;
