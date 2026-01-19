import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Breadcrumb.css';

const Breadcrumb = ({ items = [], onNavigate }) => {
  return (
    <nav className="breadcrumb">
      <div className="breadcrumb-container">
        <button 
          className="breadcrumb-item home-btn"
          onClick={() => onNavigate('/')}
          title="Dashboard"
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
        
        {items.map((item, index) => (
          <div key={index} className="breadcrumb-segment">
            <FontAwesomeIcon icon={faChevronRight} className="separator" />
            <button
              className={`breadcrumb-item ${item.isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.path)}
              disabled={item.isActive}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
