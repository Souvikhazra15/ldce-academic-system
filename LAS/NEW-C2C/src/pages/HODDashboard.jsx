import React, { useState, useEffect } from 'react';
import HODNavbar from '../components/HODNavbar';
import Footer from '../components/Footer';
import {
  Users,
  BookOpen,
  Activity,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const HODDashboard = ({ currentScreen, onScreenChange, facultyData, onLogout, onRoleSwitch }) => {
  // Academic year/Batch selection state [cite: 5, 19]
  const [selectedBatch, setSelectedBatch] = useState('2023');
  const [courses, setCourses] = useState(() => {
    const savedCourses = localStorage.getItem('hodCourses');
    if (savedCourses) {
      return JSON.parse(savedCourses);
    }
    return [];
  });
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semester: '',
    credits: '',
    department: facultyData?.dept || 'Computer Engineering',
    selectedDept: '',
    selectedFaculty: []
  });

  // Department to Faculty mapping
  const departmentFaculty = {
    'Artificial Intelligence & Machine Learning': ['Dr. Raj Kumar', 'Prof. Priya Sharma', 'Dr. Amit Patel'],
    'Automobile Engineering': ['Prof. Neha Singh', 'Dr. Vikram Joshi', 'Prof. Anil Kumar'],
    'Biomedical Engineering': ['Dr. Deepak Gupta', 'Prof. Sneha Desai', 'Dr. Ritesh Sharma'],
    'Chemical Engineering': ['Prof. Suresh Kumar', 'Dr. Meera Patel', 'Prof. Rajesh Singh'],
    'Civil Engineering': ['Dr. Mohan Rao', 'Prof. Anjali Verma', 'Dr. Sanjay Kumar'],
    'Computer Engineering': ['Dr. Raj Kumar', 'Prof. Priya Sharma', 'Dr. Amit Patel', 'Prof. Neha Singh'],
    'Electrical Engineering': ['Prof. Vikram Joshi', 'Dr. Deepak Gupta', 'Prof. Suresh Kumar'],
    'Electronics & Communication Engineering': ['Dr. Ritesh Sharma', 'Prof. Anil Kumar', 'Dr. Meera Patel'],
    'Environmental Engineering': ['Prof. Rajesh Singh', 'Dr. Mohan Rao', 'Prof. Anjali Verma'],
    'Information Technology': ['Dr. Sanjay Kumar', 'Prof. Priya Sharma', 'Dr. Amit Patel'],
    'Instrumentation & Control Engineering': ['Prof. Neha Singh', 'Dr. Vikram Joshi', 'Prof. Suresh Kumar'],
    'Mechanical Engineering': ['Dr. Deepak Gupta', 'Prof. Anil Kumar', 'Prof. Anjali Verma'],
    'Plastic Technology': ['Prof. Meera Patel', 'Dr. Ritesh Sharma', 'Prof. Rajesh Singh'],
    'Rubber Technology': ['Dr. Mohan Rao', 'Prof. Suresh Kumar', 'Prof. Anil Kumar'],
    'Textile Technology': ['Prof. Priya Sharma', 'Dr. Sanjay Kumar', 'Prof. Neha Singh']
  };

  const availableDepartments = [
    'Artificial Intelligence & Machine Learning',
    'Automobile Engineering',
    'Biomedical Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Computer Engineering',
    'Electrical Engineering',
    'Electronics & Communication Engineering',
    'Environmental Engineering',
    'Information Technology',
    'Instrumentation & Control Engineering',
    'Mechanical Engineering',
    'Plastic Technology',
    'Rubber Technology',
    'Textile Technology'
  ];

  // Data updates based on selected batch [cite: 7]
  const batchStats = {
    '2023': { faculty: 18, classes: 12, attendance: '84%', access: '03' },
    '2022': { faculty: 16, classes: 10, attendance: '79%', access: '02' },
    '2021': { faculty: 20, classes: 14, attendance: '88%', access: '04' }
  };

  const current = batchStats[selectedBatch] || batchStats['2023'];

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hodCourses', JSON.stringify(courses));
  }, [courses]);

  const handleAddCourse = () => {
    if (!formData.name || !formData.code || !formData.semester || !formData.credits || !formData.department || !formData.selectedDept || formData.selectedFaculty.length === 0) {
      alert('Please fill all fields, select department and faculty');
      return;
    }

    const newCourse = {
      id: Date.now(),
      name: formData.name,
      code: formData.code,
      semester: formData.semester,
      credits: formData.credits,
      department: formData.department,
      accessDept: formData.selectedDept,
      accessFaculty: formData.selectedFaculty,
      createdBy: 'HoD',
      addedDate: new Date().toLocaleDateString()
    };

    setCourses([...courses, newCourse]);
    setShowAddCourseModal(false);
    setFormData({ name: '', code: '', semester: '', credits: '', department: facultyData?.dept || 'Computer Engineering', selectedDept: '', selectedFaculty: [] });
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== courseId));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDepartmentChange = (e) => {
    const deptName = e.target.value;
    setFormData(prev => ({
      ...prev,
      selectedDept: deptName,
      selectedFaculty: [] // Reset faculty when department changes
    }));
  };

  const handleFacultyChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      selectedFaculty: prev.selectedFaculty.includes(value)
        ? prev.selectedFaculty.filter(f => f !== value)
        : [...prev.selectedFaculty, value]
    }));
  };

  return (
    <div className="dashboard-page-wrapper">
      <HODNavbar facultyName={facultyData?.name || "HoD"} onScreenChange={onScreenChange} onLogout={onLogout} onRoleSwitch={onRoleSwitch} />

      <div className="dashboard">
        <main className="dashboard-main">

          {/* 1. Header: Dept Title & Batch Selector [cite: 4, 5, 19] */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ color: '#1e3a8a', margin: 0, fontSize: '1.6rem', fontWeight: 'bold' }}>
                {facultyData?.dept || "Computer Engineering"} Dashboard
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                Academic Year Overview [cite: 5]
              </p>
            </div>

            {/* Batch Year Dropdown [cite: 5, 6, 19] */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', background: 'white',
              padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <Calendar size={18} color="#1e3a8a" />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Batch:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                style={{ border: 'none', background: 'transparent', color: '#1e3a8a', fontWeight: 'bold', outline: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
              >
                <option value="2023">2023 Entry Batch</option>
                <option value="2022">2022 Entry Batch</option>
                <option value="2021">2021 Entry Batch</option>
              </select>
            </div>
          </div>

          {/* 2. Summary Cards Grid [cite: 4, 8] */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <StatCard title="Total Faculty" value={current.faculty} icon={<Users size={20} />} color="#8b5cf6" />
            <StatCard title="Total Classes" value={current.classes} icon={<BookOpen size={20} />} color="#3b82f6" />
            <StatCard title="Avg Attendance" value={current.attendance} icon={<Activity size={20} />} color="#10b981" />

            {/* Active Access Card (Clickable) [cite: 8, 10, 31] */}
            <div
              onClick={() => onScreenChange('accessControl')}
              style={{
                background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#f59e0b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: '#fef3c7', color: '#f59e0b', padding: '10px', borderRadius: '10px' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Active Access</p>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b', fontWeight: 'bold' }}>{current.access}</h3>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Used by other depts </span>
                <ChevronRight size={14} color="#f59e0b" />
              </div>
            </div>
          </div>

          {/* Manage Courses Section */}
          <div style={{ marginTop: '30px', background: 'white', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h4 style={{ margin: 0, color: '#1a3a52', fontWeight: 'bold', fontSize: '1.1rem' }}>Manage Courses</h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>Total: {courses.length} course(s)</p>
              </div>
              <button
                onClick={() => setShowAddCourseModal(true)}
                style={{
                  background: '#1e40af',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                + Add Course
              </button>
            </div>

            {courses.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e0e7ff', backgroundColor: '#f0f6ff' }}>
                      <th style={{ padding: '12px 15px', color: '#1a3a52', fontWeight: '600' }}>Course Name</th>
                      <th style={{ padding: '12px 15px', color: '#1a3a52', fontWeight: '600' }}>Code</th>
                      <th style={{ padding: '12px 15px', color: '#1a3a52', fontWeight: '600' }}>Semester</th>
                      <th style={{ padding: '12px 15px', color: '#1a3a52', fontWeight: '600' }}>Credits</th>
                      <th style={{ padding: '12px 15px', color: '#1a3a52', fontWeight: '600' }}>Department</th>
                      <th style={{ padding: '12px 15px', color: '#1a3a52', fontWeight: '600' }}>Faculty</th>
                      <th style={{ padding: '12px 15px', color: '#1a3a52', fontWeight: '600' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} style={{ borderBottom: '1px solid #e0e7ff' }}>
                        <td style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>{course.name}</td>
                        <td style={{ padding: '12px 15px', color: '#666' }}>{course.code}</td>
                        <td style={{ padding: '12px 15px', color: '#666' }}>{course.semester}</td>
                        <td style={{ padding: '12px 15px', color: '#666' }}>{course.credits}</td>
                        <td style={{ padding: '12px 15px', color: '#666', fontSize: '0.85rem' }}>
                          <span style={{ background: '#e0e7ff', color: '#1e40af', padding: '3px 8px', borderRadius: '4px' }}>
                            {course.accessDept?.split(' ')[0]}
                          </span>
                        </td>
                        <td style={{ padding: '12px 15px', color: '#666', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {course.accessFaculty && course.accessFaculty.slice(0, 2).map((faculty, i) => (
                              <span key={i} style={{ background: '#f0f6ff', color: '#1a3a52', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                {faculty.split(' ')[0]}
                              </span>
                            ))}
                            {course.accessFaculty && course.accessFaculty.length > 2 && (
                              <span style={{ background: '#f0f6ff', color: '#1a3a52', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                +{course.accessFaculty.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px 15px' }}>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            style={{
                              background: '#fee',
                              color: '#ef4444',
                              border: '1px solid #fecaca',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px', marginTop: '10px' }}>No courses added yet</p>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowAddCourseModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            maxWidth: '500px',
            width: '90%',
            padding: '30px'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#1a3a52', fontWeight: '700' }}>Add New Course</h2>
              <button
                onClick={() => setShowAddCourseModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#999',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1a3a52', marginBottom: '6px', fontSize: '13px' }}>Course Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g., Data Structures"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e0e7ff',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1a3a52', marginBottom: '6px', fontSize: '13px' }}>Course Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="e.g., CS101"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e0e7ff',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1a3a52', marginBottom: '6px', fontSize: '13px' }}>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  placeholder="e.g., Computer Science"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e0e7ff',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#1a3a52', marginBottom: '6px', fontSize: '13px' }}>Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e0e7ff',
                      borderRadius: '6px',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#1a3a52', marginBottom: '6px', fontSize: '13px' }}>Credits</label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleFormChange}
                    placeholder="e.g., 4"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e0e7ff',
                      borderRadius: '6px',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1a3a52', marginBottom: '10px', fontSize: '13px' }}>Select Department for Access</label>
                <select
                  name="selectedDept"
                  value={formData.selectedDept}
                  onChange={handleDepartmentChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e0e7ff',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff',
                    color: '#1a3a52'
                  }}
                >
                  <option value="">-- Select Department --</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {formData.selectedDept && (
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#1a3a52', marginBottom: '10px', fontSize: '13px' }}>Select Faculty from {formData.selectedDept}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', padding: '8px', border: '1px solid #e0e7ff', borderRadius: '6px', backgroundColor: '#f9fbff' }}>
                    {departmentFaculty[formData.selectedDept]?.map((faculty) => (
                      <label key={faculty} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', padding: '6px' }}>
                        <input
                          type="checkbox"
                          checked={formData.selectedFaculty.includes(faculty)}
                          onChange={() => handleFacultyChange({ target: { value: faculty } })}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        <span style={{ color: '#1a3a52' }}>{faculty}</span>
                      </label>
                    ))}
                  </div>
                  {formData.selectedFaculty.length > 0 && (
                    <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#1e40af' }}>Selected: {formData.selectedFaculty.length} faculty</p>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowAddCourseModal(false)}
                  style={{
                    background: '#f3f4f6',
                    color: '#1a3a52',
                    border: '1px solid #e5e7eb',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCourse}
                  style={{
                    background: '#1e40af',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Add Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal StatCard Helper
const StatCard = ({ title, value, icon, color }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
    <div style={{ background: `${color}15`, color: color, padding: '12px', borderRadius: '12px' }}>{icon}</div>
    <div>
      <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>{title}</p>
      <h3 style={{ margin: '2px 0 0', fontSize: '1.4rem', color: '#1e293b', fontWeight: 'bold' }}>{value}</h3>
    </div>
  </div>
);

export default HODDashboard;