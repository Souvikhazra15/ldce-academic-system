import React from 'react';
import '../styles/TabContent.css';

const AssessmentsTab = ({ assessments = [] }) => {
  // Mock assessments data - will be replaced with API call
  const mockAssessments = [
    {
      id: 'ASS1',
      type: 'Quiz',
      title: 'Data Structures Basics Quiz',
      totalMarks: 10,
      weightage: 10,
      description: 'Online quiz covering fundamental concepts'
    },
    {
      id: 'ASS2',
      type: 'Assignment',
      title: 'Implementation Assignment',
      totalMarks: 20,
      weightage: 20,
      description: 'Implement 3 data structures with documentation'
    },
    {
      id: 'ASS3',
      type: 'Practical Exam',
      title: 'Lab Exam',
      totalMarks: 20,
      weightage: 20,
      description: 'Hands-on practical examination'
    },
    {
      id: 'ASS4',
      type: 'Final Exam',
      title: 'Comprehensive Final Exam',
      totalMarks: 50,
      weightage: 50,
      description: 'End-term comprehensive examination'
    }
  ];

  const data = assessments.length > 0 ? assessments : mockAssessments;

  return (
    <div className="tab-content">
      <div className="section">
        <h4 className="section-title">Assessment Methods</h4>
        <div className="assessments-container">
          {data.map((assessment) => (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-header">
                <div>
                  <h5>{assessment.title}</h5>
                  <p className="assessment-type">{assessment.type}</p>
                </div>
                <div className="assessment-marks">
                  <span className="marks-badge">{assessment.totalMarks} marks</span>
                  <span className="weightage-badge">{assessment.weightage}%</span>
                </div>
              </div>
              <p className="assessment-description">{assessment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentsTab;
