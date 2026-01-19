import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBars, faUser, faChevronDown, faSignOutAlt, faTasks, faClipboard, faFileAlt, faChartBar, faUsers, faShieldAlt, faUserTie, faFileText } from '@fortawesome/free-solid-svg-icons';
import HODNavigationModal from './HODNavigationModal';
import '../styles/Navbar.css';

function HODNavbar({ facultyName = "HoD", onScreenChange, onLogout, onRoleSwitch }) {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navModalOpen, setNavModalOpen] = useState(false);

  const tabs = [
    { id: 'hodDashboard', label: 'Dashboard', icon: faBook, path: '/hod-dashboard' },
    { id: 'studentData', label: 'Students', icon: faUsers, path: '/student-data' },
    { id: 'accessControl', label: 'Access Control', icon: faShieldAlt, path: '/access-control' },
    { id: 'facultyMapping', label: 'Faculty Mapping', icon: faUserTie, path: '/faculty-mapping' },
    { id: 'reportViewer', label: 'Reports', icon: faFileText, path: '/report-viewer' }
  ];

  const pathToTab = {
    '/hod-dashboard': 'hodDashboard',
    '/student-data': 'studentData',
    '/access-control': 'accessControl',
    '/faculty-mapping': 'facultyMapping',
    '/report-viewer': 'reportViewer'
  };

  const activeTab = pathToTab[location.pathname] || 'hodDashboard';

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
              <span className="navbar-subtitle">HoD Portal • Management</span>
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
                  <div
                    className="navbar-dropdown-item switch-mode"
                    onClick={() => {
                      if (onRoleSwitch) {
                        onRoleSwitch('faculty');
                      }
                      setUserMenuOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faTasks} />
                    Switch to Faculty Mode
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
      <HODNavigationModal
        isOpen={navModalOpen}
        onClose={() => setNavModalOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
}

export default HODNavbar;