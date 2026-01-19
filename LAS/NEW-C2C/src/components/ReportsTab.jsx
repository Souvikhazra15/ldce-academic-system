import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import '../styles/TabContent.css';

const ReportsTab = ({ reports = [] }) => {
  // Mock reports data - will be replaced with API call
  const mockReports = [
    {
      id: 'REP1',
      title: 'Class Performance Report',
      description: 'Overall class performance metrics and statistics',
      generatedDate: '2024-11-15',
      type: 'PDF'
    },
    {
      id: 'REP2',
      title: 'Attendance Summary',
      description: 'Student attendance records and patterns',
      generatedDate: '2024-11-10',
      type: 'Excel'
    },
    {
      id: 'REP3',
      title: 'Assessment Analysis',
      description: 'Detailed analysis of student assessment performance',
      generatedDate: '2024-11-05',
      type: 'PDF'
    }
  ];

  const data = reports.length > 0 ? reports : mockReports;

  const handleView = (reportId) => {
    console.log(`View report: ${reportId}`);
    // Will integrate: fetch and display/open report
    // const response = await fetch(`/api/reports/${reportId}`)
  };

  const handleDownload = (reportId) => {
    console.log(`Download report: ${reportId}`);
    // Will integrate: download report
    // const response = await fetch(`/api/reports/${reportId}/download`)
  };

  return (
    <div className="tab-content">
      <div className="section">
        <h4 className="section-title">Generated Reports</h4>
        <div className="reports-container">
          {data.length > 0 ? (
            data.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div>
                    <h5>{report.title}</h5>
                    <p className="report-date">Generated: {report.generatedDate}</p>
                  </div>
                  <span className="report-type">{report.type}</span>
                </div>
                <p className="report-description">{report.description}</p>
                <div className="report-actions">
                  <button 
                    className="report-btn view-btn"
                    onClick={() => handleView(report.id)}
                    title="View Report"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    <span>View</span>
                  </button>
                  <button 
                    className="report-btn download-btn"
                    onClick={() => handleDownload(report.id)}
                    title="Download Report"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-reports">No reports available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
