import React, { useState, useEffect } from 'react';
import HODNavbar from '../components/HODNavbar';
import Footer from '../components/Footer';
import { Search, GraduationCap } from 'lucide-react';

const StudentData = ({ currentScreen, onScreenChange, facultyData, onLogout, onRoleSwitch }) => {
  const [batchYear, setBatchYear] = useState('Year 2023');
  const [section, setSection] = useState('IT-3-A');
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Mock Database
  const studentDatabase = {
    'Year 2023-IT-3-A': [
      { roll: '23IT001', name: 'Aarav Patel', enroll: '202303103001', type: 'Regular' },
      { roll: '23IT002', name: 'Ishani Sharma', enroll: '202303103002', type: 'Regular' }
    ],
    'Year 2022-IT-5-A': [
      { roll: '22IT045', name: 'Kabir Shah', enroll: '202203103045', type: 'D2D' }
    ]
  };

  useEffect(() => {
    const key = `${batchYear}-${section}`;
    setFilteredStudents(studentDatabase[key] || []);
  }, [batchYear, section]);

  // Unified Dropdown Style to match image_cfdaad.png
  const dropdownContainerStyle = {
    background: 'white',
    padding: '6px 16px',
    borderRadius: '25px', // Rounded pill shape
    border: '1.5px solid #1e3a8a', // Dark blue border
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  const selectStyle = {
    border: 'none',
    background: 'transparent',
    color: '#1e3a8a', // Blue text
    fontWeight: 'bold',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    appearance: 'none', // Removes default arrow for custom look
    paddingRight: '5px'
  };

  return (
    <div className="dashboard-page-wrapper">
      <HODNavbar facultyName={facultyData?.name || "HoD"} onScreenChange={onScreenChange} onLogout={onLogout} onRoleSwitch={onRoleSwitch} />

      <div className="dashboard">
        <main className="dashboard-main">
        <div className="student-data-wrapper" style={{ animation: 'fadeIn 0.3s ease', padding: '30px 20px' }}>

          {/* 1. Header & Dynamic Selection Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ color: '#1e3a8a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={28} /> Student Records
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              {/* Batch Selector */}
              <div style={dropdownContainerStyle}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#64748b' }}>Batch:</span>
                <select
                  value={batchYear}
                  onChange={(e) => setBatchYear(e.target.value)}
                  style={selectStyle}
                >
                  <option value="Year 2023">Year 2023</option>
                  <option value="Year 2022">Year 2022</option>
                </select>
              </div>

              {/* Class Selector */}
              <div style={dropdownContainerStyle}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#64748b' }}>Class:</span>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  style={selectStyle}
                >
                  <option value="IT-3-A">IT-3-A</option>
                  <option value="IT-5-A">IT-5-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Table Section */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#1e3a8a', color: 'white' }}>
                <tr>
                  <th style={{ padding: '15px' }}>Roll No</th>
                  <th style={{ padding: '15px' }}>Full Name</th>
                  <th style={{ padding: '15px' }}>Enrollment No</th>
                  <th style={{ padding: '15px' }}>Admission</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold', color: '#1e3a8a' }}>{student.roll}</td>
                      <td style={{ padding: '15px', color: '#334155' }}>{student.name}</td>
                      <td style={{ padding: '15px', color: '#64748b' }}>{student.enroll}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold',
                          background: student.type === 'D2D' ? '#fef3c7' : '#f0f9ff',
                          color: student.type === 'D2D' ? '#9a3412' : '#0369a1'
                        }}>
                          {student.type}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      No records found for {section} ({batchYear}).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentData;