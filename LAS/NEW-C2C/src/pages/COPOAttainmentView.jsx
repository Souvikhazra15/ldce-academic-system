import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faBarChart, faEye } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/COPOAttainmentView.css';
import { formatCourseLabel } from '../utils/courseFormatter';

const COPOAttainmentView = ({ currentScreen, courseId = 'CS101', onScreenChange, facultyData, onLogout }) => {
  // Mock courses data
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
    },
    { 
      id: 'CS103', 
      name: 'Database Management', 
      code: '3137003',
      abbr: 'DB',
      department: 'IT',
      semester: 3,
      division: 'B1'
    }
  ];

  // Mock data - will be replaced with API calls
  const mockCOs = [
    { id: 'CO1', name: 'Understand Data Structure Fundamentals', attainment: 78 },
    { id: 'CO2', name: 'Implement and Apply', attainment: 82 },
    { id: 'CO3', name: 'Analyze and Optimize', attainment: 71 },
    { id: 'CO4', name: 'Design Solutions', attainment: 85 },
    { id: 'CO5', name: 'Problem Solving', attainment: 75 },
    { id: 'CO6', name: 'Communication Skills', attainment: 80 }
  ];

  const mockComponentScores = {
    CO1: { mid: 3.0, internal: 3.0, pbl: 2.5, overall_internal: 2.90, end: 2.0, viva: 3.0, overall_external: 2.30, final: 2.60 },
    CO2: { mid: 3.5, internal: 3.2, pbl: 2.8, overall_internal: 3.17, end: 2.5, viva: 3.2, overall_external: 2.85, final: 3.01 },
    CO3: { mid: 2.8, internal: 2.9, pbl: 2.4, overall_internal: 2.70, end: 1.8, viva: 2.8, overall_external: 2.30, final: 2.50 },
    CO4: { mid: 3.4, internal: 3.3, pbl: 2.9, overall_internal: 3.20, end: 2.6, viva: 3.3, overall_external: 2.95, final: 3.08 },
    CO5: { mid: 3.0, internal: 2.9, pbl: 2.5, overall_internal: 2.80, end: 2.2, viva: 3.0, overall_external: 2.60, final: 2.70 },
    CO6: { mid: 3.2, internal: 3.1, pbl: 2.7, overall_internal: 3.0, end: 2.4, viva: 3.1, overall_external: 2.75, final: 2.88 }
  };

  const mockPOs = [
    { id: 'PO1', name: 'Engineering Knowledge' },
    { id: 'PO2', name: 'Problem Analysis' },
    { id: 'PO3', name: 'Design/Development' },
    { id: 'PO4', name: 'Conduct Investigations' },
    { id: 'PO5', name: 'Modern Tool Usage' },
    { id: 'PO6', name: 'Individual & Team Work' },
    { id: 'PO7', name: 'Communication' },
    { id: 'PO8', name: 'Environment & Sustainability' },
    { id: 'PO9', name: 'Professional Ethics' },
    { id: 'PO10', name: 'Lifelong Learning' },
    { id: 'PO11', name: 'Project Management' },
    { id: 'PO12', name: 'Societal Context' }
  ];

  const mockPSOs = [
    { id: 'PSO1', name: 'Advanced Programming' },
    { id: 'PSO2', name: 'Web Technologies' },
    { id: 'PSO3', name: 'Data Analytics' },
    { id: 'PSO4', name: 'Cloud Computing' }
  ];

  const mockCOPOPSOMapping = {
    CO1: { 
      PO1: 1.69, PO2: 0, PO3: 0, PO4: 0, PO5: 0, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1.69, PO11: 0.84, PO12: 0,
      PSO1: 0, PSO2: 0, PSO3: 0, PSO4: 0
    },
    CO2: {
      PO1: 0, PO2: 0, PO3: 0, PO4: 0, PO5: 0, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 0.64, PO11: 0, PO12: 0,
      PSO1: 0, PSO2: 0, PSO3: 0, PSO4: 0
    },
    CO3: {
      PO1: 0, PO2: 0, PO3: 0, PO4: 0, PO5: 0, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1.69, PO11: 1.69, PO12: 0,
      PSO1: 0, PSO2: 0, PSO3: 0, PSO4: 0
    },
    CO4: {
      PO1: 0, PO2: 0, PO3: 0, PO4: 0, PO5: 0, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 0, PO11: 0.84, PO12: 0,
      PSO1: 0, PSO2: 0, PSO3: 0, PSO4: 0
    },
    CO5: {
      PO1: 0, PO2: 0, PO3: 0, PO4: 0, PO5: 0, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 0, PO11: 1.69, PO12: 0,
      PSO1: 0, PSO2: 0, PSO3: 0, PSO4: 0
    },
    CO6: {
      PO1: 0, PO2: 0, PO3: 0, PO4: 0, PO5: 0, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 0, PO11: 0, PO12: 0,
      PSO1: 0, PSO2: 0, PSO3: 0, PSO4: 0
    }
  };

  // State Management
  const [selectedCourse, setSelectedCourse] = useState(courseId);
  const [coData, setCoData] = useState(mockCOs);
  const [poData, setPoData] = useState(mockPOs);
  const [psoData, setPsoData] = useState(mockPSOs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [selectedCourse]);

  const getAttainmentLevel = (percentage) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Satisfactory';
    if (percentage >= 50) return 'Needs Improvement';
    return 'Below Target';
  };

  const getAttainmentColor = (percentage) => {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 60) return 'satisfactory';
    if (percentage >= 50) return 'needs-improvement';
    return 'below-target';
  };

  const averageCOAttainment = coData.length > 0
    ? Math.round(coData.reduce((sum, co) => sum + co.attainment, 0) / coData.length)
    : 0;

  if (loading) {
    return (
      <div className="co-po-attainment-view">
        <div className="loading">Loading attainment data...</div>
      </div>
    );
  }

  return (
    <div className="co-po-attainment-view-wrapper">
      <Navbar facultyName={facultyData?.name || 'Dr. Raj Kumar'} currentScreen={currentScreen} onScreenChange={onScreenChange} onLogout={onLogout} />
      <div className="co-po-attainment-view">
        <div className="co-po-main">
          {/* Page Header */}
          <div className="co-po-header">
            <h1>CO-PO Attainment View</h1>
            <div className="read-only-badge">
              <FontAwesomeIcon icon={faLock} />
              <span>Read-Only</span>
            </div>
          </div>

          {/* Content Card */}
          <div className="co-po-content-card">
            <div className="attainment-container">
              {/* Course Selection */}
              <div className="course-selection">
                <label htmlFor="course-select">Select Course:</label>
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

              {/* Overview Stats */}
              <div className="overview-stats">
                <div className="stat-card">
                  <div className="stat-label">Course Outcomes</div>
                  <div className="stat-value">{coData.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Average CO Attainment</div>
                  <div className="stat-value">{averageCOAttainment}%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Program Outcomes Impacted</div>
                  <div className="stat-value">{poData.length}</div>
                </div>
        </div>

        {/* CO Attainment - Component Level */}
        <div className="section">
          <h3 className="section-title">CO Attainment - Component Level</h3>
          <p className="section-subtitle">Attainment scores across assessment components</p>

          <div className="table-wrapper">
            <table className="component-level-table">
              <thead>
                <tr>
                  <th className="component-co-col">CO</th>
                  <th className="component-col">Mid (M)</th>
                  <th className="component-col">Internal (I)</th>
                  <th className="component-col">PBL</th>
                  <th className="component-col">Overall Internal</th>
                  <th className="component-col">End (E)</th>
                  <th className="component-col">Viva (V)</th>
                  <th className="component-col">Overall External</th>
                  <th className="component-col">Overall (Final)</th>
                </tr>
              </thead>
              <tbody>
                {coData.map((co) => (
                  <tr key={co.id} className="component-level-row">
                    <td className="component-co-cell">{co.id}</td>
                    <td className="component-cell">{mockComponentScores[co.id]?.mid.toFixed(1)}</td>
                    <td className="component-cell">{mockComponentScores[co.id]?.internal.toFixed(1)}</td>
                    <td className="component-cell">{mockComponentScores[co.id]?.pbl.toFixed(1)}</td>
                    <td className="component-cell">{mockComponentScores[co.id]?.overall_internal.toFixed(2)}</td>
                    <td className="component-cell">{mockComponentScores[co.id]?.end.toFixed(1)}</td>
                    <td className="component-cell">{mockComponentScores[co.id]?.viva.toFixed(1)}</td>
                    <td className="component-cell">{mockComponentScores[co.id]?.overall_external.toFixed(2)}</td>
                    <td className="component-cell component-final">{mockComponentScores[co.id]?.final.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CO Summary */}
        <div className="section">
          <h3 className="section-title">CO Attainment Summary</h3>
          <div className="table-wrapper">
            <table className="co-summary-table">
              <thead>
                <tr>
                  {coData.map((co) => (
                    <th key={co.id} className="summary-co-header">{co.id}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {coData.map((co) => (
                    <td key={co.id} className="summary-co-cell">{mockComponentScores[co.id]?.final.toFixed(2)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CO-PO & PSO Mapping Matrix */}
        <div className="section">
          <h3 className="section-title">CO-PO & PSO Attainment Matrix</h3>

          <div className="matrix-wrapper">
            <table className="co-po-pso-matrix">
              <thead>
                <tr>
                  <th className="matrix-srno">Sr. No</th>
                  <th className="matrix-co">CO</th>
                  {poData.map((po) => (
                    <th key={po.id} className="matrix-po">
                      {po.id}
                    </th>
                  ))}
                  {psoData.map((pso) => (
                    <th key={pso.id} className="matrix-pso">
                      {pso.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coData.map((co, idx) => (
                  <tr key={co.id} className="matrix-data-row">
                    <td className="matrix-srno-cell">{idx + 1}</td>
                    <td className="matrix-co-cell">{co.id}</td>
                    {poData.map((po) => (
                      <td key={`${co.id}-${po.id}`} className="matrix-po-cell">
                        {mockCOPOPSOMapping[co.id]?.[po.id] ? mockCOPOPSOMapping[co.id][po.id].toFixed(2) : ''}
                      </td>
                    ))}
                    {psoData.map((pso) => (
                      <td key={`${co.id}-${pso.id}`} className="matrix-pso-cell">
                        {mockCOPOPSOMapping[co.id]?.[pso.id] ? mockCOPOPSOMapping[co.id][pso.id].toFixed(2) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Summary Row */}
                <tr className="matrix-summary-row">
                  <td className="matrix-summary-label" colSpan="2">TOTAL / COURSE CODE</td>
                  {poData.map((po) => {
                    const total = coData.reduce((sum, co) => sum + (mockCOPOPSOMapping[co.id]?.[po.id] || 0), 0);
                    return <td key={`total-${po.id}`} className="matrix-summary-cell">{total > 0 ? total.toFixed(2) : ''}</td>;
                  })}
                  {psoData.map((pso) => {
                    const total = coData.reduce((sum, co) => sum + (mockCOPOPSOMapping[co.id]?.[pso.id] || 0), 0);
                    return <td key={`total-${pso.id}`} className="matrix-summary-cell">{total > 0 ? total.toFixed(2) : ''}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="matrix-note">
            <strong>Note:</strong> This matrix shows the contribution of each CO to POs and PSOs. Values represent attainment percentages automatically calculated from assessment data.
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <FontAwesomeIcon icon={faLock} />
          <p>
            This view is <strong>read-only</strong> and provides transparency into how your course outcomes contribute to program outcomes. Data is automatically calculated from your assessment submissions and cannot be manually edited here.
          </p>
        </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default COPOAttainmentView;
