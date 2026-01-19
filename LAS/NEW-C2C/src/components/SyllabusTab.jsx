import React from 'react';
import '../styles/TabContent.css';

const SyllabusTab = ({ syllabus = {} }) => {
  // Mock syllabus data - will be replaced with API call
  const mockSyllabus = {
    courseCode: 'CS101',
    courseName: 'Data Structures',
    credits: 3,
    prerequisite: 'Introduction to Programming',
    objectives: [
      'Understand fundamental data structures and their applications',
      'Learn algorithm design and complexity analysis',
      'Implement various data structures in practice'
    ],
    units: [
      {
        unitNo: 1,
        title: 'Introduction to Data Structures',
        topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues'],
        hours: 12
      },
      {
        unitNo: 2,
        title: 'Trees and Graphs',
        topics: ['Binary Trees', 'Tree Traversal', 'Graphs', 'Graph Algorithms'],
        hours: 15
      },
      {
        unitNo: 3,
        title: 'Sorting and Searching',
        topics: ['Sorting Algorithms', 'Search Techniques', 'Complexity Analysis'],
        hours: 12
      }
    ]
  };

  const data = Object.keys(syllabus).length > 0 ? syllabus : mockSyllabus;

  return (
    <div className="tab-content">
      <div className="syllabus-header">
        <div className="course-info">
          <h3>{data.courseName}</h3>
          <p><strong>Course Code:</strong> {data.courseCode}</p>
          <p><strong>Credits:</strong> {data.credits}</p>
          <p><strong>Prerequisite:</strong> {data.prerequisite}</p>
        </div>
      </div>

      <div className="section">
        <h4 className="section-title">Course Objectives</h4>
        <ul className="objectives-list">
          {data.objectives?.map((obj, idx) => (
            <li key={idx}>{obj}</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h4 className="section-title">Course Units</h4>
        <div className="units-container">
          {data.units?.map((unit) => (
            <div key={unit.unitNo} className="unit-card">
              <div className="unit-header">
                <h5>Unit {unit.unitNo}: {unit.title}</h5>
                <span className="unit-hours">{unit.hours} hrs</span>
              </div>
              <ul className="topics-list">
                {unit.topics?.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyllabusTab;
