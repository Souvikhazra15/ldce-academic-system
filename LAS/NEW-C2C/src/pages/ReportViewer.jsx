import React from 'react';
import HODNavbar from '../components/HODNavbar';
import Footer from '../components/Footer';
import { FileText, Download, FileSpreadsheet, Search } from 'lucide-react';

const ReportViewer = ({ currentScreen, onScreenChange, facultyData, onLogout, onRoleSwitch }) => {
  return (
    <div className="dashboard-page-wrapper">
      <HODNavbar facultyName={facultyData?.name || "HoD"} onScreenChange={onScreenChange} onLogout={onLogout} onRoleSwitch={onRoleSwitch} />

      <div className="dashboard">
        <main className="dashboard-main">
          <h2 style={{color: '#003366', marginBottom: '20px'}}>Report Generation Vault</h2>

          {/* Search & Filter */}
          <div style={{background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '20px', display: 'flex', gap: '15px'}}>
            <input type="text" placeholder="Filter by Faculty..." style={{flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}} />
            <select style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}><option>Semester 6</option></select>
            <button style={{background: '#003366', color: '#fff', padding: '8px 20px', border: 'none', borderRadius: '4px'}}>Search</button>
          </div>

          {/* Report List */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                  <div style={{background: '#f0f4f8', padding: '10px', borderRadius: '8px', color: '#003366'}}><FileText /></div>
                  <div>
                    <h4 style={{margin: 0, fontSize: '1rem'}}>Attendance Summary - BE-COMP-A</h4>
                    <p style={{margin: 0, fontSize: '0.8rem', color: '#888'}}>Generated: 20 Oct 2023 | Format: Monthly Archive</p>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button style={{background: '#fff', border: '1px solid #d9534f', color: '#d9534f', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <Download size={14}/> PDF
                  </button>
                  <button style={{background: '#fff', border: '1px solid #28a745', color: '#28a745', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <FileSpreadsheet size={14}/> Excel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ReportViewer;