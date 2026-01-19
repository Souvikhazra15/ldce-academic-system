import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faHome, faProjectDiagram, faClipboardList, faPencilAlt, faChartBar, faEye, faFileAlt, faArchive, faBook } from '@fortawesome/free-solid-svg-icons';
import '../styles/NavigationModal.css';

function NavigationModal({ isOpen, onClose, onNavigate }) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: faHome, color: '#4a90e2' },
    { id: 'courseOverview', label: 'Course Overview', icon: faProjectDiagram, color: '#1e40af' },
    { id: 'coUnitMappingSetup', label: 'CO-Unit Mapping', icon: faProjectDiagram, color: '#4a90e2' },
    // { id: 'attendanceEntry', label: 'Attendance', icon: faClipboardList, color: '#2e7d32' }, // Hidden temporarily
    { id: 'assessmentEntry', label: 'Assessment', icon: faPencilAlt, color: '#2e7d32' },
    { id: 'examPaperSupport', label: 'Exam Support', icon: faChartBar, color: '#f57c00' },
    { id: 'coPOAttainmentView', label: 'CO-PO View', icon: faEye, color: '#c62828' },
    { id: 'reportGenerationScreen', label: 'Reports', icon: faFileAlt, color: '#6a1b9a' },
    { id: 'academicRepository', label: 'Repository', icon: faArchive, color: '#00796b' },
    { id: 'lecturePlanning', label: 'Lecture Planning', icon: faBook, color: '#ff9800' }
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
          <h2>Faculty Portal Menu</h2>
          <p>Select a feature to continue</p>
        </div>

        {/* Navigation Grid (3x3) */}
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
          <p>NBA Accreditation Support System - LDCE</p>
        </div>
      </div>
    </div>
  );
}

export default NavigationModal;
