import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faHome, faUsers, faShieldAlt, faUserTie, faFileText } from '@fortawesome/free-solid-svg-icons';
import '../styles/NavigationModal.css';

function HODNavigationModal({ isOpen, onClose, onNavigate }) {
  const navigationItems = [
    { id: 'hodDashboard', label: 'Dashboard', icon: faHome, color: '#4a90e2' },
    { id: 'studentData', label: 'Student Data', icon: faUsers, color: '#2e7d32' },
    { id: 'accessControl', label: 'Access Control', icon: faShieldAlt, color: '#f57c00' },
    { id: 'facultyMapping', label: 'Faculty Mapping', icon: faUserTie, color: '#c62828' },
    { id: 'reportViewer', label: 'Report Viewer', icon: faFileText, color: '#6a1b9a' }
  ];

  const handleNavigate = (screenId) => {
    onNavigate(screenId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="nav-modal-overlay" onClick={onClose}>
      <div className="nav-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="nav-modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Modal Header */}
        <div className="nav-modal-header">
          <h2>HoD Portal Menu</h2>
          <p>Select a feature to continue</p>
        </div>

        {/* Navigation Grid (2x3) */}
        <div className="nav-modal-grid">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className="nav-modal-item"
              onClick={() => handleNavigate(item.id)}
              style={{ '--item-color': item.color }}
            >
              <div className="nav-modal-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <div className="nav-modal-label">{item.label}</div>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="nav-modal-footer">
          <p>NBA Accreditation Support System - HoD Portal</p>
        </div>
      </div>
    </div>
  );
}

export default HODNavigationModal;