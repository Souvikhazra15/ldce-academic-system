import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle, faBarChart } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ExamPaperSupport.css';
import { formatCourseLabel } from '../utils/courseFormatter';

const ExamPaperSupport = ({ currentScreen, courseId = 'CS101', onScreenChange, facultyData, onLogout }) => {
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

  const mockUnits = [
    { id: 'U1', name: 'Introduction to Data Structures' },
    { id: 'U2', name: 'Trees and Graphs' },
    { id: 'U3', name: 'Sorting and Searching' }
  ];

  const mockCOs = [
    { id: 'CO1', name: 'Understand Data Structure Fundamentals', bloomLevel: 'L1' },
    { id: 'CO2', name: 'Implement and Apply', bloomLevel: 'L3' },
    { id: 'CO3', name: 'Analyze and Optimize', bloomLevel: 'L4' },
    { id: 'CO4', name: 'Design Solutions', bloomLevel: 'L5' }
  ];

  const bloomLevels = [
    { id: 'L1', label: 'L1 - Remember', color: '#90CAF9' },
    { id: 'L2', label: 'L2 - Understand', color: '#81C784' },
    { id: 'L3', label: 'L3 - Apply', color: '#FFD54F' },
    { id: 'L4', label: 'L4 - Analyze', color: '#FFB74D' },
    { id: 'L5', label: 'L5 - Evaluate', color: '#EF5350' },
    { id: 'L6', label: 'L6 - Create', color: '#BA68C8' }
  ];

  // Mock CO-Unit mapping from previous setup
  const mockMapping = {
    U1: { CO1: true, CO2: true, CO3: false, CO4: false },
    U2: { CO1: false, CO2: false, CO3: true, CO4: true },
    U3: { CO1: false, CO2: true, CO3: true, CO4: true }
  };

  // State Management
  const [selectedCourse, setSelectedCourse] = useState(courseId);
  const [selectedUnit, setSelectedUnit] = useState('U1');
  const [selectedBloomLevel, setSelectedBloomLevel] = useState('L3');
  const [coverage, setCoverage] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Placeholder for API call to fetch coverage data
    // const fetchCoverage = async () => {
    //   try {
    //     const response = await fetch(`/api/courses/${selectedCourse}/exam-support`);
    //     const data = await response.json();
    //     setCoverage(data.coverage);
    //   } catch (err) {
    //     console.error('Error fetching coverage:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchCoverage();

    // Initialize coverage
    const initialCoverage = {};
    mockCOs.forEach((co) => {
      initialCoverage[co.id] = Math.floor(Math.random() * 80) + 20; // 20-100%
    });
    setCoverage(initialCoverage);
    setLoading(false);
  }, [selectedCourse]);

  const currentUnit = mockUnits.find((u) => u.id === selectedUnit);
  const coveredCOs = currentUnit
    ? mockCOs.filter((co) => mockMapping[currentUnit.id]?.[co.id])
    : [];

  const insufficientCoverage = Object.values(coverage).some((c) => c < 60);
  const averageCoverage = Object.values(coverage).length > 0
    ? Math.round(Object.values(coverage).reduce((a, b) => a + b, 0) / Object.values(coverage).length)
    : 0;

  const handleAddQuestion = () => {
    console.log(`Add question for Unit ${selectedUnit}, Bloom Level ${selectedBloomLevel}`);
    // Will integrate: open question builder modal
    alert('Question builder coming soon');
  };

  const handleExportPaper = () => {
    console.log('Export exam paper');
    // Will integrate: generate and download paper
    alert('Export functionality coming soon');
  };

  if (loading) {
    return (
      <div className="exam-paper-support">
        <div className="loading">Loading exam paper data...</div>
      </div>
    );
  }

  return (
    <div className="exam-paper-support-wrapper">
      <Navbar facultyName={facultyData?.name || 'Dr. Raj Kumar'} currentScreen={currentScreen} onScreenChange={onScreenChange} onLogout={onLogout} />
      <div className="exam-paper-support">

        <div className="exam-support-container">
          {/* Header Section */}
          <div className="exam-header">
          <h2>Exam Paper Support</h2>
          <p className="subtitle">Design CO-aligned question papers with coverage analysis</p>
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
            <label htmlFor="unit-select">Unit</label>
            <select
              id="unit-select"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="select-input"
            >
              {mockUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <div className="selection-group">
            <label htmlFor="bloom-select">Bloom's Taxonomy Level</label>
            <select
              id="bloom-select"
              value={selectedBloomLevel}
              onChange={(e) => setSelectedBloomLevel(e.target.value)}
              className="select-input"
            >
              {bloomLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Warning Section */}
        {insufficientCoverage && (
          <div className="warning-box">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <div>
              <strong>Coverage Alert:</strong> Some COs have less than 60% coverage. Consider adding more questions to improve alignment.
            </div>
          </div>
        )}

        {/* Coverage Overview */}
        <div className="coverage-section">
          <div className="section-header">
            <h3>Course Outcome Coverage</h3>
            <span className="average-badge">
              <FontAwesomeIcon icon={faBarChart} />
              Avg: {averageCoverage}%
            </span>
          </div>

          <div className="coverage-grid">
            {mockCOs.map((co) => {
              const coveragePercentage = coverage[co.id] || 0;
              const isCovered = coveredCOs.some((c) => c.id === co.id);
              
              return (
                <div key={co.id} className="coverage-card">
                  <div className="coverage-header">
                    <div className="co-info">
                      <span className="co-id">{co.id}</span>
                      <span className="co-name">{co.name}</span>
                    </div>
                    <span className={`coverage-indicator ${isCovered ? 'covered' : 'uncovered'}`}>
                      {isCovered ? (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} />
                          <span>Mapped</span>
                        </>
                      ) : (
                        <span>Not in Unit</span>
                      )}
                    </span>
                  </div>

                  <div className="coverage-bars">
                    <div className="progress-label">
                      <span>Coverage</span>
                      <span className="percentage">{coveragePercentage}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className={`progress-bar ${
                          coveragePercentage >= 80
                            ? 'excellent'
                            : coveragePercentage >= 60
                            ? 'good'
                            : coveragePercentage >= 40
                            ? 'fair'
                            : 'poor'
                        }`}
                        style={{ width: `${coveragePercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="bloom-indicator">
                    <span className="bloom-label">Target Bloom:</span>
                    <span className="bloom-level">{co.bloomLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Covered COs for Selected Unit */}
        <div className="unit-coverage-section">
          <div className="section-header">
            <h3>COs Mapped to {currentUnit?.name}</h3>
          </div>

          {coveredCOs.length > 0 ? (
            <div className="co-list">
              {coveredCOs.map((co) => (
                <div key={co.id} className="co-item">
                  <div className="co-badge">{co.id}</div>
                  <div className="co-details">
                    <p className="co-name">{co.name}</p>
                    <p className="bloom-info">Bloom Level: {co.bloomLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-coverage">
              <p>No COs mapped to this unit.</p>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="action-section">
          <button
            className="action-btn primary-btn"
            onClick={handleAddQuestion}
            title="Add a new question"
          >
            + Add Question
          </button>
          <button
            className="action-btn secondary-btn"
            onClick={handleExportPaper}
            title="Export exam paper"
          >
            Export Paper
          </button>
        </div>

        {/* Legend */}
        <div className="legend-section">
          <h4>Coverage Levels</h4>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="legend-bar excellent"></div>
              <span>Excellent (80-100%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar good"></div>
              <span>Good (60-79%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar fair"></div>
              <span>Fair (40-59%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar poor"></div>
              <span>Poor (&lt;40%)</span>
            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExamPaperSupport;
