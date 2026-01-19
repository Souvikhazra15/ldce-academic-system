import React from 'react';
import '../styles/TabContent.css';

const CourseOutcomesTab = ({ outcomes = [] }) => {
  // Mock course outcomes data - will be replaced with API call
  const mockOutcomes = [
    {
      id: 'CO1',
      title: 'Understand Data Structure Fundamentals',
      description: 'Students will be able to understand and explain various data structures and their properties',
      level: 'L1'
    },
    {
      id: 'CO2',
      title: 'Implement and Apply',
      description: 'Students will implement data structures and apply them to solve practical problems',
      level: 'L3'
    },
    {
      id: 'CO3',
      title: 'Analyze and Optimize',
      description: 'Students will analyze algorithm complexity and optimize data structure usage',
      level: 'L4'
    },
    {
      id: 'CO4',
      title: 'Design Solutions',
      description: 'Students will design efficient solutions using appropriate data structures',
      level: 'L5'
    }
  ];

  const data = outcomes.length > 0 ? outcomes : mockOutcomes;

  return (
    <div className="tab-content">
      <div className="section">
        <h4 className="section-title">Course Outcomes (CO)</h4>
        <div className="outcomes-container">
          {data.map((outcome) => (
            <div key={outcome.id} className="outcome-card">
              <div className="outcome-header">
                <h5 className="outcome-id">{outcome.id}</h5>
                <span className="bloom-level">Level {outcome.level}</span>
              </div>
              <p className="outcome-title">{outcome.title}</p>
              <p className="outcome-description">{outcome.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseOutcomesTab;
