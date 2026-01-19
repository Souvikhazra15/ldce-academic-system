import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBars, faUser, faChevronDown, faSignOutAlt, faTasks, faClipboard, faFileAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';
import NavigationModal from './NavigationModal';
import '../styles/Navbar.css';

function Navbar({ facultyName = "Faculty", onScreenChange, onLogout }) {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navModalOpen, setNavModalOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: faBook, path: '/dashboard' },
    { id: 'courseOverview', label: 'Course Overview', icon: faFileAlt, path: '/course-overview' },
    // { id: 'attendanceEntry', label: 'Attendance', icon: faClipboard, path: '/attendance' }, // Hidden temporarily
    { id: 'assessmentEntry', label: 'Assessment', icon: faTasks, path: '/assessment' },
    { id: 'coPOAttainmentView', label: 'CO-PO View', icon: faChartBar, path: '/co-po-view' },
    { id: 'reportGenerationScreen', label: 'Report', icon: faFileAlt, path: '/report' }
  ];

  const pathToTab = {
    '/dashboard': 'dashboard',
    '/course-overview': 'courseOverview',
    // '/attendance': 'attendanceEntry', // Hidden temporarily
    '/assessment': 'assessmentEntry',
    '/co-po-view': 'coPOAttainmentView',
    '/report': 'reportGenerationScreen'
  };

  const activeTab = pathToTab[location.pathname] || 'dashboard';

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleNavModal = () => {
    setNavModalOpen(!navModalOpen);
  };

  const handleNavigate = (screenId) => {
    try {
      if (onScreenChange) {
        onScreenChange(screenId);
      }
      setNavModalOpen(false);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo Section */}
          <div className="navbar-logo">
            <img src="/LAS-Logo.svg" alt="LAS Logo" className="navbar-logo-image" />
            <div className="navbar-logo-text">
              <span className="navbar-title">LDCE Academic System</span>
              <span className="navbar-subtitle">Syllabus • Assessment • Outcome</span>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="navbar-tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`navbar-tab ${activeTab === tab.id ? 'active' : ''}`}
                title={tab.label}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </Link>
            ))}
          </div>

          {/* Menu Button in Center */}
          <button 
            className="navbar-hamburger-center"
            onClick={toggleNavModal}
            title="Navigation Menu"
          >
            <FontAwesomeIcon icon={faBars} />
            <span>Menu</span>
          </button>

          {/* Right Side Controls */}
          <div className="navbar-right">
            {/* User Menu */}
            <div className="navbar-user-menu">
              <button className="navbar-user-btn" onClick={toggleUserMenu}>
                <FontAwesomeIcon icon={faUser} className="navbar-user-icon" />
                <span className="navbar-user-name">{facultyName}</span>
                <FontAwesomeIcon icon={faChevronDown} className="navbar-dropdown-icon" />
              </button>
              {userMenuOpen && (
                <div className="navbar-dropdown">
                  <div 
                    className="navbar-dropdown-item profile"
                    onClick={() => {
                      try {
                        if (onScreenChange) {
                          onScreenChange('profile');
                        }
                        setUserMenuOpen(false);
                      } catch (error) {
                        console.error('Profile navigation error:', error);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Profile
                  </div>
                  <div className="navbar-dropdown-divider"></div>
                  <div className="navbar-dropdown-item logout" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Modal */}
      <NavigationModal 
        isOpen={navModalOpen}
        onClose={() => setNavModalOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
}

export default Navbar;
