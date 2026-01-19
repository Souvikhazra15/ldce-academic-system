import React from 'react';
import '../styles/TabNavigation.css';

const TabNavigation = ({ tabs = [], activeTab, onTabChange }) => {
  return (
    <div className="tab-navigation">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
