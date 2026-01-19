import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faPencilAlt, faBook, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/CourseCard.css';

const CourseCard = ({ 
  courseId,
  courseName, 
  classSemester, 
  onTakeAttendance,
  onEnterAssessment,
  onViewSyllabus,
  onGenerateReport 
}) => {
  return (
    <div className="course-card">
      <div className="card-header">
        <h3 className="course-name">{courseName}</h3>
        <p className="class-semester">{classSemester}</p>
      </div>
      
      <div className="card-actions">
        <button 
          className="action-btn attendance-btn"
          onClick={() => onTakeAttendance(courseId)}
          title="Take Attendance"
        >
          <FontAwesomeIcon icon={faClipboardList} className="btn-icon" />
          <span>Attendance</span>
        </button>
        <button 
          className="action-btn assessment-btn"
          onClick={() => onEnterAssessment(courseId)}
          title="Enter Assessment"
        >
          <FontAwesomeIcon icon={faPencilAlt} className="btn-icon" />
          <span>Assessment</span>
        </button>
        <button 
          className="action-btn syllabus-btn"
          onClick={() => onViewSyllabus(courseId)}
          title="View Syllabus"
        >
          <FontAwesomeIcon icon={faBook} className="btn-icon" />
          <span>Syllabus</span>
        </button>
        <button 
          className="action-btn report-btn"
          onClick={() => onGenerateReport(courseId)}
          title="Generate Report"
        >
          <FontAwesomeIcon icon={faFileAlt} className="btn-icon" />
          <span>Report</span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
