import React from 'react';
import HODNavbar from '../components/HODNavbar';
import Footer from '../components/Footer';
import { ShieldCheck, Search, Trash2, PlusCircle } from 'lucide-react';

const AccessControl = ({ currentScreen, onScreenChange, facultyData, onLogout, onRoleSwitch }) => {
  return (
    <div className="dashboard-page-wrapper">
      <HODNavbar facultyName={facultyData?.name || "HoD"} onScreenChange={onScreenChange} onLogout={onLogout} onRoleSwitch={onRoleSwitch} />

      <div className="dashboard">
        <main className="dashboard-main">
          <div style={{marginBottom: '20px'}}>
            <h2 style={{color: '#003366'}}>Inter-Department Access Control</h2>
            <p style={{color: '#666', fontSize: '0.9rem'}}>Grant and manage class access for teaching departments</p>
          </div>

          {/* Access Form */}
          <div style={{background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee'}}>
            <h4 style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#003366'}}>
              <PlusCircle size={20}/> Grant New Access
            </h4>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px'}}>
              <div>
                <label style={{display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px', color: '#555'}}>Parent Dept</label>
                <select style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#f9f9f9'}} disabled>
                  <option>Computer Engineering</option>
                </select>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px', color: '#555'}}>Semester</label>
                <select style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}>
                  <option>Semester 4</option>
                  <option>Semester 6</option>
                </select>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px', color: '#555'}}>Class/Batch</label>
                <input type="text" placeholder="e.g. BE-A" style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px', color: '#555'}}>Teaching Dept</label>
                <select style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}>
                  <option>Information Technology</option>
                  <option>Applied Mechanics</option>
                </select>
              </div>
            </div>
            <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
              <button style={{background: '#003366', color: '#fff', padding: '10px 25px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}>Grant Access</button>
            </div>
          </div>

          {/* Existing Access Table */}
          <div style={{background: '#fff', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden'}}>
            <div style={{padding: '15px', background: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h4 style={{margin: 0, color: '#003366'}}>Active Access Permissions</h4>
              <div style={{position: 'relative'}}>
                <Search size={16} style={{position: 'absolute', left: '10px', top: '10px', color: '#999'}}/>
                <input type="text" placeholder="Search entries..." style={{padding: '8px 8px 8px 35px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '0.85rem'}} />
              </div>
            </div>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead style={{background: '#fcfcfc', borderBottom: '2px solid #eee'}}>
                <tr>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#666'}}>Semester</th>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#666'}}>Class/Batch</th>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#666'}}>Teaching Dept</th>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#666'}}>Status</th>
                  <th style={{padding: '15px', fontSize: '0.85rem', color: '#666'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '15px', fontSize: '0.9rem'}}>Sem 6</td>
                  <td style={{padding: '15px', fontSize: '0.9rem', fontWeight: 'bold'}}>BE-COMP-B</td>
                  <td style={{padding: '15px', fontSize: '0.9rem'}}>Information Technology</td>
                  <td style={{padding: '15px'}}><span style={{background: '#e6ffed', color: '#28a745', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'}}>ACTIVE</span></td>
                  <td style={{padding: '15px'}}><button style={{color: '#d9534f', background: 'none', border: 'none', cursor: 'pointer'}} title="Revoke Access"><Trash2 size={18}/></button></td>
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

export default AccessControl;