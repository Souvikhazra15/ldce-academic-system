import React from 'react';
import HODNavbar from '../components/HODNavbar';
import Footer from '../components/Footer';
import { Filter, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const FacultyMapping = ({ currentScreen, onScreenChange, facultyData, onLogout, onRoleSwitch }) => {
  return (
    <div className="dashboard-page-wrapper">
      <HODNavbar facultyName={facultyData?.name || "HoD"} onScreenChange={onScreenChange} onLogout={onLogout} onRoleSwitch={onRoleSwitch} />

      <div className="dashboard">
        <main className="dashboard-main">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px'}}>
            <div>
              <h2 style={{color: '#003366', margin: 0}}>Faculty-Class Mapping</h2>
              <p style={{color: '#666', fontSize: '0.9rem'}}>Overview of teaching assignments and workload</p>
            </div>
            <button style={{background: '#28a745', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold'}}>
              <Download size={18} /> Export Data
            </button>
          </div>

          {/* Filters Section */}
          <div style={{background: '#fff', padding: '15px', borderRadius: '8px 8px 0 0', border: '1px solid #eee', display: 'flex', gap: '15px', alignItems: 'center'}}>
             <Filter size={18} color="#666" />
             <select style={{padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem'}}>
               <option>All Semesters</option>
               <option>Sem 4</option>
               <option>Sem 6</option>
             </select>
             <select style={{padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem'}}>
               <option>All Faculty</option>
             </select>
             <div style={{marginLeft: 'auto', position: 'relative'}}>
               <Search size={16} style={{position: 'absolute', left: '10px', top: '8px', color: '#999'}} />
               <input type="text" placeholder="Search course..." style={{padding: '6px 10px 6px 35px', borderRadius: '4px', border: '1px solid #ccc'}} />
             </div>
          </div>

          {/* Table */}
          <div style={{background: '#fff', border: '1px solid #eee', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead style={{background: '#f8f9fa', borderBottom: '2px solid #eee'}}>
                <tr>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#555'}}>Faculty Name</th>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#555'}}>Course</th>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#555'}}>Class/Div</th>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#555'}}>Lectures</th>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#555'}}>Attendance</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '15px'}}>
                    <div style={{fontWeight: 'bold', color: '#333'}}>Dr. Rajesh Kumar</div>
                    <div style={{fontSize: '0.75rem', color: '#888'}}>Comp. Dept</div>
                  </td>
                  <td style={{padding: '15px', fontSize: '0.9rem'}}>Microprocessors</td>
                  <td style={{padding: '15px', fontSize: '0.9rem'}}>BE-COMP-A</td>
                  <td style={{padding: '15px'}}><span style={{background: '#e7f0fd', color: '#003366', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold'}}>24</span></td>
                  <td style={{padding: '15px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div style={{flexGrow: 1, height: '6px', background: '#eee', borderRadius: '3px', width: '60px'}}>
                        <div style={{width: '82%', height: '100%', background: '#28a745', borderRadius: '3px'}}></div>
                      </div>
                      <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>82%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default FacultyMapping;