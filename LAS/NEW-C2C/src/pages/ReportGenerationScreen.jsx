import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faDownload, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ReportGenerationScreen.css';

function ReportGenerationScreen({ currentScreen, courseId, onScreenChange, facultyData, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([
    { id: 'CS101', name: 'Data Structures' },
    { id: 'CS102', name: 'Web Development' },
    { id: 'CS103', name: 'Database Systems' },
    { id: 'CS104', name: 'Computer Networks' }
  ]);
  
  const [semesters] = useState([
    { id: 1, name: 'Semester 1 (Fall 2024)' },
    { id: 2, name: 'Semester 2 (Spring 2025)' },
    { id: 3, name: 'Semester 3 (Fall 2025)' }
  ]);

  const [reportTypes] = useState([
    { id: 'course', label: 'Course Report', description: 'Comprehensive course overview with outcomes and assessments' },
    { id: 'coAttainment', label: 'CO Attainment Report', description: 'Detailed course outcome attainment analysis' },
    { id: 'assessment', label: 'Assessment Summary', description: 'Assessment results and performance metrics' }
  ]);

  const [selectedCourse, setSelectedCourse] = useState('CS101');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedReportType, setSelectedReportType] = useState('course');
  const [generatedReports, setGeneratedReports] = useState([
    {
      id: 1,
      type: 'Course Report',
      course: 'Data Structures',
      semester: 'Semester 1 (Fall 2024)',
      generatedDate: '2024-12-15',
      formats: ['PDF', 'Excel']
    },
    {
      id: 2,
      type: 'CO Attainment Report',
      course: 'Data Structures',
      semester: 'Semester 1 (Fall 2024)',
      generatedDate: '2024-12-14',
      formats: ['PDF']
    },
    {
      id: 3,
      type: 'Assessment Summary',
      course: 'Web Development',
      semester: 'Semester 1 (Fall 2024)',
      generatedDate: '2024-12-10',
      formats: ['PDF', 'Excel']
    }
  ]);

  const handleGenerateReport = async () => {
    setLoading(true);
    console.log(`Generate Report - Course: ${selectedCourse}, Semester: ${selectedSemester}, Type: ${selectedReportType}`);
    
    // TODO: Uncomment when backend is ready
    // const response = await fetch('/api/reports/generate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     courseId: selectedCourse,
    //     semesterId: selectedSemester,
    //     reportType: selectedReportType
    //   })
    // });
    // const newReport = await response.json();
    
    // Simulate report generation
    setTimeout(() => {
      const reportTypeObj = reportTypes.find(rt => rt.id === selectedReportType);
      const courseObj = courses.find(c => c.id === selectedCourse);
      const semesterObj = semesters.find(s => s.id === selectedSemester);
      
      const newReport = {
        id: generatedReports.length + 1,
        type: reportTypeObj.label,
        course: courseObj.name,
        semester: semesterObj.name,
        generatedDate: new Date().toISOString().split('T')[0],
        formats: Math.random() > 0.5 ? ['PDF', 'Excel'] : ['PDF']
      };
      
      setGeneratedReports([newReport, ...generatedReports]);
      setLoading(false);
    }, 1500);
  };

  const handleDownload = (reportId, format) => {
    const report = generatedReports.find(r => r.id === reportId);
    console.log(`Download ${format} - Report: ${report.type} for ${report.course}`);
    
    // TODO: Uncomment when backend is ready
    // const response = await fetch(`/api/reports/${reportId}/download?format=${format}`);
    // const blob = await response.blob();
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `${report.type}_${format.toLowerCase()}.${format === 'PDF' ? 'pdf' : 'xlsx'}`;
    // a.click();
  };

  return (
    <div className="report-generation-screen-wrapper">
      <Navbar facultyName={facultyData?.name || 'Dr. Raj Kumar'} currentScreen={currentScreen} onScreenChange={onScreenChange} onLogout={onLogout} />
      <div className="report-generation-screen">
        <div className="report-generation-main">
          {/* Page Header */}
          <div className="report-generation-header">
            <h1>Report Generation</h1>
          </div>

          {/* Content Card */}
          <div className="report-generation-content-card">
            <div className="rgs-container">
              {/* Header Section */}
              <div className="rgs-header">
                <p className="rgs-subtitle">Generate NBA-ready reports with minimal effort</p>
              </div>

              {/* Filters and Generate Section */}
              <div className="rgs-controls">
                <div className="rgs-filters">
                  {/* Course Filter */}
                  <div className="rgs-filter-group">
                    <label htmlFor="course-select">Select Course</label>
                    <select 
                      id="course-select"
                      value={selectedCourse} 
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="rgs-select"
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name} ({course.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Filter */}
                  <div className="rgs-filter-group">
                    <label htmlFor="semester-select">Select Semester</label>
                    <select 
                      id="semester-select"
                      value={selectedSemester} 
                      onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                className="rgs-select"
              >
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Report Type Selection */}
          <div className="rgs-report-types">
            <h3>Select Report Type</h3>
            <div className="rgs-type-options">
              {reportTypes.map(type => (
                <div 
                  key={type.id}
                  className={`rgs-type-card ${selectedReportType === type.id ? 'active' : ''}`}
                  onClick={() => setSelectedReportType(type.id)}
                >
                  <div className="rgs-type-radio">
                    <input 
                      type="radio" 
                      name="reportType" 
                      value={type.id}
                      checked={selectedReportType === type.id}
                      onChange={() => setSelectedReportType(type.id)}
                    />
                  </div>
                  <div className="rgs-type-content">
                    <h4>{type.label}</h4>
                    <p>{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button 
            className="rgs-generate-btn"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Generating...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} /> Generate Report
              </>
            )}
          </button>
        </div>

        {/* Generated Reports List */}
        <div className="rgs-reports">
          <h2>Generated Reports</h2>
          {generatedReports.length === 0 ? (
            <div className="rgs-empty">
              <p>No reports generated yet. Select filters and generate your first report.</p>
            </div>
          ) : (
            <div className="rgs-reports-list">
              {generatedReports.map(report => (
                <div key={report.id} className="rgs-report-item">
                  <div className="rgs-report-info">
                    <div className="rgs-report-header">
                      <FontAwesomeIcon icon={faFileAlt} className="rgs-report-icon" />
                      <div className="rgs-report-details">
                        <h4>{report.type}</h4>
                        <p className="rgs-report-course">{report.course}</p>
                        <p className="rgs-report-semester">{report.semester}</p>
                      </div>
                    </div>
                    <span className="rgs-report-date">{report.generatedDate}</span>
                  </div>
                  
                  <div className="rgs-report-actions">
                    {report.formats.map(format => (
                      <button 
                        key={format}
                        className="rgs-download-btn"
                        onClick={() => handleDownload(report.id, format)}
                        title={`Download as ${format}`}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReportGenerationScreen;
