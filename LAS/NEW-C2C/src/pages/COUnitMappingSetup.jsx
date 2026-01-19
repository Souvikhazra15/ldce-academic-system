import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faLock } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/COUnitMappingSetup.css';
import { formatCourseLabel } from '../utils/courseFormatter';

const COUnitMappingSetup = ({ courseId = 'CS101', onScreenChange }) => {
  // Mock data - will be replaced with API call
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
    { id: 'CO1', name: 'Understand Data Structure Fundamentals' },
    { id: 'CO2', name: 'Implement and Apply' },
    { id: 'CO3', name: 'Analyze and Optimize' },
    { id: 'CO4', name: 'Design Solutions' }
  ];

  // Mock mapping data
  const mockMappingData = {
    U1: { CO1: 'High', CO2: 'Medium', CO3: '', CO4: '' },
    U2: { CO1: 'Medium', CO2: '', CO3: 'High', CO4: 'Medium' },
    U3: { CO1: '', CO2: 'High', CO3: 'Medium', CO4: 'High' }
  };

  const [selectedCourse, setSelectedCourse] = useState(courseId);
  const [units, setUnits] = useState(mockUnits);
  const [cos, setCos] = useState(mockCOs);
  const [mapping, setMapping] = useState(mockMappingData);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Placeholder for API call to fetch units, COs, and existing mapping
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(`/api/courses/${selectedCourse}/co-unit-mapping`);
    //     const data = await response.json();
    //     setUnits(data.units);
    //     setCos(data.cos);
    //     setMapping(data.mapping);
    //     setIsLocked(data.isLocked);
    //   } catch (err) {
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    setLoading(false);
  }, [selectedCourse]);

  const handleCellChange = (unitId, coId, value) => {
    if (isLocked) return;

    setMapping((prev) => ({
      ...prev,
      [unitId]: {
        ...prev[unitId],
        [coId]: value
      }
    }));
  };

  const handleSaveAndLock = async () => {
    setIsSaving(true);
    try {
      // Placeholder for API call to save mapping
      // const response = await fetch(`/api/courses/${courseId}/co-unit-mapping`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ mapping, isLocked: true })
      // });
      
      console.log('Saving mapping:', mapping);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLocked(true);
      alert('Mapping saved and locked successfully!');
    } catch (err) {
      console.error('Error saving mapping:', err);
      alert('Error saving mapping. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      setMapping(mockMappingData);
    }
  };

  if (loading) {
    return (
      <div className="co-unit-mapping-setup">
        <div className="loading">Loading course data...</div>
      </div>
    );
  }

  return (
    <div className="co-unit-mapping-setup-wrapper">
      <Navbar facultyName="Dr. Raj Kumar" onScreenChange={onScreenChange} />
      <div className="co-unit-mapping-setup">

        <div className="mapping-setup-container">
        {/* Header Section */}
        <div className="mapping-header">
          <div className="title-section">
            <h2>CO-Unit Mapping Setup</h2>
            <p className="subtitle">One-time mapping used for assessment and reports</p>
          </div>
          
          <div className="info-note">
            <strong>Note:</strong> This mapping will be locked after saving and used for all future assessments and reports.
          </div>
        </div>

        {/* Course Selection */}
        <div className="selection-panel" style={{ marginBottom: '30px' }}>
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
        </div>

        {/* Mapping Table Section */}
        <div className="mapping-table-section">
          <div className="table-wrapper">
            <table className="mapping-table">
              <thead>
                <tr>
                  <th className="unit-header-cell">Unit</th>
                  {cos.map((co) => (
                    <th key={co.id} className="co-header-cell">
                      <div className="co-header-content">
                        <span className="co-id">{co.id}</span>
                        <span className="co-name">{co.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id}>
                    <td className="unit-cell">
                      <div className="unit-content">
                        <span className="unit-id">{unit.id}</span>
                        <span className="unit-name">{unit.name}</span>
                      </div>
                    </td>
                    {cos.map((co) => (
                      <td key={`${unit.id}-${co.id}`} className="mapping-cell">
                        <select
                          className={`mapping-select ${mapping[unit.id]?.[co.id] ? 'has-value' : ''}`}
                          value={mapping[unit.id]?.[co.id] || ''}
                          onChange={(e) => handleCellChange(unit.id, co.id, e.target.value)}
                          disabled={isLocked}
                          title={isLocked ? 'Mapping is locked' : 'Select CO intensity'}
                        >
                          <option value="">—</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mapping-legend">
            <div className="legend-item">
              <span className="legend-indicator high"></span>
              <span>High - Direct contribution to CO</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator medium"></span>
              <span>Medium - Partial contribution to CO</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator low"></span>
              <span>Low - Minimal contribution to CO</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mapping-actions">
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isLocked || isSaving}
            title="Reset all changes"
          >
            Reset
          </button>
          <button
            className={`btn btn-primary ${isLocked ? 'locked' : ''}`}
            onClick={handleSaveAndLock}
            disabled={isLocked || isSaving}
            title={isLocked ? 'Mapping is locked' : 'Save and lock mapping'}
          >
            <FontAwesomeIcon icon={isLocked ? faLock : faSave} />
            <span>{isLocked ? 'Mapping Locked' : 'Save & Lock Mapping'}</span>
            {isSaving && <span className="saving">Saving...</span>}
          </button>
        </div>

        {/* Status Message */}
        {isLocked && (
          <div className="status-message locked-message">
            <FontAwesomeIcon icon={faLock} />
            <span>This mapping is now locked and cannot be modified.</span>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default COUnitMappingSetup;
