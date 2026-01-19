import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AssessmentEntry.css';
import { formatCourseLabel, formatCourseReference } from '../utils/courseFormatter';

const AssessmentEntry = ({ currentScreen, courseId = 'CS101', onScreenChange, facultyData, onLogout }) => {
  // CO mark allocations for each assessment type
  const coAllocations = {
    Mid: [30, 30, 30, 4, 4, 6],         // CO1-CO3: 30 each, Total: 104
    Internal: [30, 30, 30, 3, 4, 4],   // CO1-CO3: 30 each, Total: 101
    PBL: [30, 30, 30, 4, 4, 6],        // CO1-CO3: 30 each, Total: 104
    External: [30, 30, 30, 19, 18, 0], // CO1-CO3: 30 each, Total: 127
    Viva: [30, 30, 30, 8, 8, 8]       // CO1-CO3: 30 each, Total: 114
  };

  // Assessment types with their max marks
  const assessmentTypes = [
    { id: 'Mid', label: 'Mid', maxMarks: 30 },
    { id: 'Internal', label: 'Internal', maxMarks: 20 },
    { id: 'PBL', label: 'PBL', maxMarks: 30 },
    { id: 'External', label: 'External GTU', maxMarks: 70 },
    { id: 'Viva', label: 'Viva', maxMarks: 50 }
  ];

  const COs = ['CO-1', 'CO-2', 'CO-3', 'CO-4', 'CO-5', 'CO-6'];

  // Mock data - will be replaced with API calls
  const mockCourses = [
    { 
      id: 'CS101', 
      name: 'Data Structures', 
      code: '3137001',
      abbr: 'DS',
      department: 'IT',
      semester: 3,
      division: 'B1'
    },
    { 
      id: 'CS102', 
      name: 'Web Development', 
      code: '3137002',
      abbr: 'WD',
      department: 'IT',
      semester: 3,
      division: 'B2'
    }
  ];

  const mockStudents = [
    { enrollmentNo: '220110001', name: 'Aarav Sharma', coMarks: [0, 0, 0, 0, 0, 0] },
    { enrollmentNo: '220110002', name: 'Bhavna Patel', coMarks: [0, 0, 0, 0, 0, 0] },
    { enrollmentNo: '220110003', name: 'Chirag Desai', coMarks: [0, 0, 0, 0, 0, 0] },
    { enrollmentNo: '220110004', name: 'Divya Nair', coMarks: [0, 0, 0, 0, 0, 0] },
    { enrollmentNo: '220110005', name: 'Eshan Verma', coMarks: [0, 0, 0, 0, 0, 0] },
    { enrollmentNo: '220110006', name: 'Fiona Gupta', coMarks: [0, 0, 0, 0, 0, 0] },
    { enrollmentNo: '220110007', name: 'Gaurav Singh', coMarks: [0, 0, 0, 0, 0, 0] },
    { enrollmentNo: '220110008', name: 'Hana Khan', coMarks: [0, 0, 0, 0, 0, 0] },
  ];

  // State Management
  const [selectedCourse, setSelectedCourse] = useState(courseId);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState('Mid');
  const [students, setStudents] = useState(mockStudents);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDraft, setIsDraft] = useState(false);

  // CO Threshold State
  const [coThresholds, setCoThresholds] = useState({
    'CO-1': { maxMarks: 10, thresholdPercent: 40 },
    'CO-2': { maxMarks: 15, thresholdPercent: 40 },
    'CO-3': { maxMarks: 20, thresholdPercent: 35 },
    'CO-4': { maxMarks: 15, thresholdPercent: 40 },
    'CO-5': { maxMarks: 10, thresholdPercent: 40 },
    'CO-6': { maxMarks: 10, thresholdPercent: 40 }
  });

  // Get current assessment type details
  const currentAssessment = assessmentTypes.find(a => a.id === selectedAssessmentType);
  const currentCOAllocations = coAllocations[selectedAssessmentType] || coAllocations.Mid;
  const totalMarks = currentAssessment?.maxMarks || 30;
  const currentCourse = mockCourses.find(c => c.id === selectedCourse);

  useEffect(() => {
    setLoading(false);
  }, [selectedCourse]);

  // Handle CO mark change for a specific student
  const handleCOMarkChange = (enrollmentNo, coIndex, value) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    const maxCOMarks = currentCOAllocations[coIndex];
    
    // Prevent exceeding max marks for this CO
    if (numValue > maxCOMarks) {
      return;
    }

    setStudents(students.map(student => {
      if (student.enrollmentNo === enrollmentNo) {
        const newCoMarks = [...student.coMarks];
        newCoMarks[coIndex] = numValue;
        return { ...student, coMarks: newCoMarks };
      }
      return student;
    }));
    setSuccessMessage('');
  };

  // Distribute marks evenly to all students
  const handleDistributeMarks = () => {
    const distributedMarks = currentCOAllocations.map(max => 
      Math.floor(max * 0.8)
    );
    
    setStudents(students.map(student => ({
      ...student,
      coMarks: [...distributedMarks]
    })));
  };

  // Clear all marks
  const handleClearMarks = () => {
    setStudents(students.map(student => ({
      ...student,
      coMarks: [0, 0, 0, 0, 0, 0]
    })));
  };

  // Calculate total marks for a student
  const calculateTotal = (coMarks) => {
    return coMarks.reduce((sum, mark) => sum + mark, 0);
  };

  // Handle CO threshold changes
  const handleThresholdChange = (co, field, value) => {
    const numValue = field === 'thresholdPercent' ? Math.min(100, Math.max(0, parseInt(value) || 0)) : parseInt(value) || 0;
    setCoThresholds(prev => ({
      ...prev,
      [co]: {
        ...prev[co],
        [field]: numValue
      }
    }));
  };

  // Calculate threshold marks for a CO
  const calculateThresholdMarks = (co) => {
    const threshold = coThresholds[co];
    return Math.ceil((threshold.maxMarks * threshold.thresholdPercent) / 100);
  };

  // Calculate CO-wise stats
  const calculateCOStats = (coIndex) => {
    const thresholdMarks = calculateThresholdMarks(COs[coIndex]);
    const studentsAboveThreshold = students.filter(s => s.coMarks[coIndex] >= thresholdMarks).length;
    const achievementPercent = Math.round((studentsAboveThreshold / students.length) * 100);
    
    let attainmentLevel = 'Level 1 (Low)';
    if (achievementPercent >= 70) {
      attainmentLevel = 'Level 3 (High)';
    } else if (achievementPercent >= 60) {
      attainmentLevel = 'Level 2 (Medium)';
    }

    return {
      studentsAboveThreshold,
      totalStudents: students.length,
      achievementPercent,
      attainmentLevel
    };
  };

  // Save as draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setSuccessMessage('Error: You are not logged in. Please refresh and login again.');
        setSaving(false);
        return;
      }

      // Only send data that matches the simplified schema
      const assessmentData = {
        courseId: selectedCourse,
        assessmentSubType: selectedAssessmentType,
        studentMarksData: students.map(student => ({
          enrollmentNo: student.enrollmentNo,
          studentName: student.name,
          CO1: student.coMarks[0] || 0,
          CO2: student.coMarks[1] || 0,
          CO3: student.coMarks[2] || 0,
          CO4: student.coMarks[3] || 0,
          CO5: student.coMarks[4] || 0,
          CO6: student.coMarks[5] || 0,
          total: calculateTotal(student.coMarks)
        })),
        coAttainmentData: Object.keys(coThresholds).reduce((acc, co) => {
          const coIndex = parseInt(co.replace('CO-', '')) - 1;
          const stats = calculateCOStats(coIndex);
          acc[co] = {
            maxMarks: coThresholds[co].maxMarks,
            thresholdPercent: coThresholds[co].thresholdPercent,
            thresholdMarks: calculateThresholdMarks(co),
            studentsAboveThreshold: stats.studentsAboveThreshold,
            totalStudents: stats.totalStudents,
            achievementPercent: stats.achievementPercent,
            attainmentLevel: stats.attainmentLevel
          };
          return acc;
        }, {})
      };

      // Save to backend API
      const response = await fetch('http://localhost:5000/api/assessment/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assessmentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Token is invalid, clear it and ask user to login again
          localStorage.removeItem('authToken');
          throw new Error('Session expired. Please refresh the page and login again.');
        }
        throw new Error(errorData.message || errorData.error || `Failed to save assessment (Status: ${response.status})`);
      }

      const result = await response.json();
      console.log('Draft saved:', result);

      setSuccessMessage('Assessment saved as draft successfully!');
      setIsDraft(true);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
      setSuccessMessage(`Error: ${error.message}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Submit assessment
  const handleSubmitAssessment = async () => {
    const incompleteStudents = students.filter(s => {
      const total = calculateTotal(s.coMarks);
      return total === 0;
    });

    if (incompleteStudents.length > 0) {
      alert(`Please enter marks for all students. ${incompleteStudents.length} students have no marks.`);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setSuccessMessage('Error: You are not logged in. Please refresh and login again.');
        setSaving(false);
        return;
      }

      // Only send data that matches the simplified schema
      const assessmentData = {
        courseId: selectedCourse,
        assessmentSubType: selectedAssessmentType,
        studentMarksData: students.map(student => ({
          enrollmentNo: student.enrollmentNo,
          studentName: student.name,
          CO1: student.coMarks[0] || 0,
          CO2: student.coMarks[1] || 0,
          CO3: student.coMarks[2] || 0,
          CO4: student.coMarks[3] || 0,
          CO5: student.coMarks[4] || 0,
          CO6: student.coMarks[5] || 0,
          total: calculateTotal(student.coMarks)
        })),
        coAttainmentData: Object.keys(coThresholds).reduce((acc, co) => {
          const coIndex = parseInt(co.replace('CO-', '')) - 1;
          const stats = calculateCOStats(coIndex);
          acc[co] = {
            maxMarks: coThresholds[co].maxMarks,
            thresholdPercent: coThresholds[co].thresholdPercent,
            thresholdMarks: calculateThresholdMarks(co),
            studentsAboveThreshold: stats.studentsAboveThreshold,
            totalStudents: stats.totalStudents,
            achievementPercent: stats.achievementPercent,
            attainmentLevel: stats.attainmentLevel
          };
          return acc;
        }, {})
      };

      // Submit to backend API
      const response = await fetch('http://localhost:5000/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assessmentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Token is invalid, clear it and ask user to login again
          localStorage.removeItem('authToken');
          throw new Error('Session expired. Please refresh the page and login again.');
        }
        throw new Error(errorData.message || errorData.error || `Failed to submit assessment (Status: ${response.status})`);
      }

      const result = await response.json();
      console.log('Assessment submitted:', result);

      setSuccessMessage('Assessment submitted successfully!');
      setIsDraft(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setSuccessMessage(`Error: ${error.message}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="assessment-entry-wrapper">
      <Navbar facultyName={facultyData?.name || 'Dr. Raj Kumar'} currentScreen={currentScreen} onScreenChange={onScreenChange} onLogout={onLogout} />
      <div className="assessment-entry">
        <div className="assessment-main">
          {/* Page Header */}
          <div className="assessment-header-container">
            <div className="assessment-header">
              <h1>Assessment Entry</h1>
            </div>
          </div>

          {/* Content Card */}
          <div className="assessment-content-card">
            <div className="assessment-container">
              {/* Header Section */}
              <div className="assessment-header-section">
                <p className="subtitle">CO-based marking system</p>
              </div>

              {/* Selection Panel */}
          <div className="selection-panel">
            <div className="selection-group">
              <label htmlFor="course-select">Course</label>
              <select
                id="course-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="select-input"
              >
                {mockCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {formatCourseLabel(course)}
                  </option>
                ))}
              </select>
            </div>

            <div className="selection-group">
              <label htmlFor="assessment-type">Assessment Type</label>
              <select
                id="assessment-type"
                value={selectedAssessmentType}
                onChange={(e) => setSelectedAssessmentType(e.target.value)}
                className="select-input"
              >
                {assessmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label} ({type.maxMarks} marks)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Info Box */}
          <div className="info-box">
            <strong>Assessment Type:</strong> {currentAssessment?.label} | 
            <strong> Total Marks:</strong> {totalMarks} | 
            <strong> CO Distribution:</strong> {currentCOAllocations.join(', ')}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button
              className="action-btn distribute-btn"
              onClick={handleDistributeMarks}
              disabled={saving}
              title="Fill 80% of max marks for each CO"
            >
              Fill 80%
            </button>
            <button
              className="action-btn clear-btn"
              onClick={handleClearMarks}
              disabled={saving}
              title="Clear all marks"
            >
              Clear All
            </button>
          </div>

          {/* Marks Entry Table - CO Based */}
          {loading ? (
            <div className="loading">Loading students...</div>
          ) : (
            <div className="table-wrapper">
              <table className="marks-table">
                <thead>
                  <tr>
                    <th className="sr-no-header">Sr. No</th>
                    <th className="enrollment-header">Enrollment No</th>
                    <th className="name-header">Student Name</th>
                    {COs.map((co, idx) => (
                      <th key={idx} className="co-header">
                        {co}<br/>
                        <span className="co-max">({currentCOAllocations[idx]})</span>
                      </th>
                    ))}
                    <th className="total-header">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.enrollmentNo} className="student-row">
                      <td className="sr-no-col">{index + 1}</td>
                      <td className="enrollment-col">{student.enrollmentNo}</td>
                      <td className="name-col">{student.name}</td>
                      {student.coMarks.map((mark, coIdx) => (
                        <td key={coIdx} className="co-col">
                          <input
                            type="number"
                            min="0"
                            max={currentCOAllocations[coIdx]}
                            value={mark}
                            onChange={(e) => handleCOMarkChange(student.enrollmentNo, coIdx, e.target.value)}
                            className="marks-input"
                            placeholder="0"
                            disabled={saving}
                            title={`Max: ${currentCOAllocations[coIdx]}`}
                          />
                        </td>
                      ))}
                      <td className="total-col total-cell">{calculateTotal(student.coMarks)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Combined CO Analysis Table */}
          <div className="co-threshold-section">
            <h3 className="section-title">CO Analysis & Configuration</h3>
            <p className="section-subtitle">Threshold configuration, achievement analysis, and attainment levels</p>
            <div className="table-wrapper threshold-table-wrapper">
              <table className="threshold-table combined-table">
                <thead>
                  <tr>
                    <th className="co-col-header">CO</th>
                    <th className="max-marks-header">Max Marks</th>
                    <th className="threshold-percent-header">Threshold %</th>
                    <th className="threshold-marks-header">Threshold Marks</th>
                    <th className="students-achieved-header">Students ≥ Threshold</th>
                    <th className="total-students-header">Total Students</th>
                    <th className="achievement-percent-header">Achievement %</th>
                    <th className="attainment-level-header">Attainment Level</th>
                  </tr>
                </thead>
                <tbody>
                  {COs.map((co, idx) => {
                    const stats = calculateCOStats(idx);
                    return (
                      <tr key={co} className="combined-threshold-row">
                        <td className="co-cell">{co}</td>
                        <td className="marks-cell">
                          <input
                            type="number"
                            min="0"
                            value={coThresholds[co].maxMarks}
                            onChange={(e) => handleThresholdChange(co, 'maxMarks', e.target.value)}
                            className="threshold-input"
                          />
                        </td>
                        <td className="percent-cell">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={coThresholds[co].thresholdPercent}
                            onChange={(e) => handleThresholdChange(co, 'thresholdPercent', e.target.value)}
                            className="threshold-input"
                          />
                          %
                        </td>
                        <td className="threshold-marks-cell">{calculateThresholdMarks(co)}</td>
                        <td className="threshold-cell">{stats.studentsAboveThreshold}</td>
                        <td className="total-cell">{stats.totalStudents}</td>
                        <td className="achievement-cell">{stats.achievementPercent}%</td>
                        <td className="attainment-cell">{stats.attainmentLevel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Section */}
          <div className="submit-section">
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}
            <div className="button-group">
              <button
                className="btn btn-secondary"
                onClick={handleSaveDraft}
                disabled={saving}
                title="Save as draft"
              >
                <FontAwesomeIcon icon={faSave} />
                <span>{saving && isDraft ? 'Saving...' : 'Save Draft'}</span>
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitAssessment}
                disabled={saving}
                title="Submit assessment"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>{saving && !isDraft ? 'Submitting...' : 'Submit'}</span>
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AssessmentEntry;

