import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBook, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardComponent from '../components/Dashboard';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Dashboard = ({ currentScreen, onScreenChange, facultyData, onLogout }) => {
  // Load courses from localStorage or use default
  const [courses, setCourses] = useState(() => {
    // First check if HoD has added courses
    const hodCourses = localStorage.getItem('hodCourses');
    const savedCourses = localStorage.getItem('facultyCourses');
    
    if (savedCourses) {
      return JSON.parse(savedCourses);
    }
    
    // If HoD has courses, show only those where faculty's department has access
    if (hodCourses) {
      const parsedHodCourses = JSON.parse(hodCourses);
      const facultyDept = facultyData?.dept || 'Computer Engineering';
      const facultyName = facultyData?.name || 'Dr. Raj Kumar';
      
      // Filter courses where faculty's department AND faculty name have access
      const accessibleCourses = parsedHodCourses.filter(course => 
        course.accessDept === facultyDept && 
        course.accessFaculty && 
        course.accessFaculty.includes(facultyName)
      );
      
      return accessibleCourses.map(c => ({
        id: c.id,
        name: c.name,
        code: c.code,
        department: c.department,
        semester: c.semester,
        credits: c.credits
      }));
    }
    
    return [
      { id: 1, name: 'Data Structures', code: 'CS101', department: 'Computer Science', semester: '3', credits: 4 },
      { id: 2, name: 'Web Development', code: 'CS102', department: 'Computer Science', semester: '4', credits: 3 },
      { id: 3, name: 'Database Management', code: 'CS103', department: 'Computer Science', semester: '3', credits: 4 }
    ];
  });
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddCoursePage, setShowAddCoursePage] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  // Get available accessible courses from HoD
  const [availableAccessibleCourses] = useState(() => {
    const hodCourses = localStorage.getItem('hodCourses');
    if (hodCourses) {
      const parsedHodCourses = JSON.parse(hodCourses);
      const facultyDept = facultyData?.dept || 'Computer Engineering';
      const facultyName = facultyData?.name || 'Dr. Raj Kumar';
      
      return parsedHodCourses.filter(course => 
        course.accessDept === facultyDept && 
        course.accessFaculty && 
        course.accessFaculty.includes(facultyName)
      );
    }
    return [];
  });

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('facultyCourses', JSON.stringify(courses));
  }, [courses]);

  const handleAddCourseClick = () => {
    setShowAddCourseModal(true);
  };

  const handleSelectAccessibleCourse = (course) => {
    // Check if course already added
    if (courses.some(c => c.id === course.id)) {
      alert('This course is already added');
      return;
    }

    const newCourse = {
      id: course.id,
      name: course.name,
      code: course.code,
      department: course.department,
      semester: course.semester,
      credits: course.credits
    };

    setCourses([...courses, newCourse]);
    setShowAddCourseModal(false);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId));
      setShowAddCoursePage(false);
      setSelectedCourse(null);
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setShowAddCoursePage(true);
  };

  const handleBackFromCourse = () => {
    setShowAddCoursePage(false);
    setSelectedCourse(null);
  };

  if (showAddCoursePage) {
    return <CourseManagementPage course={selectedCourse} onBack={handleBackFromCourse} onDeleteCourse={handleDeleteCourse} onScreenChange={onScreenChange} />;
  }

  return (
    <div className="dashboard-page-wrapper">
      <Navbar facultyName={facultyData?.name || 'Dr. Raj Kumar'} onScreenChange={onScreenChange} onLogout={onLogout} />
      <div className="dashboard">
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1>My Courses</h1>
            <button className="btn-add-course" onClick={handleAddCourseClick}>
              <FontAwesomeIcon icon={faPlus} /> Add Courses
            </button>
          </div>

          <div className="courses-list">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className="course-card" onClick={() => handleSelectCourse(course)}>
                  <div className="course-card-icon">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <div className="course-card-content">
                    <h3>{course.name}</h3>
                    <p className="course-code">{course.code}</p>
                    <p className="course-details">Semester {course.semester} | Credits {course.credits || '-'}</p>
                  </div>
                  <div className="course-card-arrow">›</div>
                </div>
              ))
            ) : (
              <div className="no-courses">
                <p>No courses added yet. Click "Add Courses" to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* Select Available Courses Modal */}
      {showAddCourseModal && (
        <div className="modal-overlay" onClick={() => setShowAddCourseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select Courses</h2>
              <button className="modal-close" onClick={() => setShowAddCourseModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="modal-body">
              {availableAccessibleCourses && availableAccessibleCourses.length > 0 ? (
                <div className="courses-selection-list">
                  {availableAccessibleCourses.map((course) => (
                    <div key={course.id} className="course-selection-item">
                      <div className="course-selection-info">
                        <h4>{course.name}</h4>
                        <p className="course-selection-code">Code: {course.code}</p>
                        <div className="course-selection-meta">
                          <span>Semester: {course.semester}</span>
                          <span>Credits: {course.credits || '-'}</span>
                          <span>Dept: {course.department}</span>
                        </div>
                      </div>
                      <button 
                        className="btn-select-course"
                        onClick={() => handleSelectAccessibleCourse(course)}
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-accessible-courses">
                  <p>No courses available for you.</p>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                    Contact your HoD to get access to courses in your department.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Course Management Page Component
const CourseManagementPage = ({ course, onBack, onDeleteCourse, onScreenChange }) => {
  const [students, setStudents] = useState([
    { id: 1, rollNo: '001', name: 'Aarav Sharma', present: false, absent: false },
    { id: 2, rollNo: '002', name: 'Bhavna Patel', present: false, absent: false },
    { id: 3, rollNo: '003', name: 'Chirag Desai', present: false, absent: false },
    { id: 4, rollNo: '004', name: 'Divya Nair', present: false, absent: false },
    { id: 5, rollNo: '005', name: 'Eshan Verma', present: false, absent: false }
  ]);
  
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [lectureNo, setLectureNo] = useState('1');
  const [timePeriod, setTimePeriod] = useState('semester');
  const [attendanceStats, setAttendanceStats] = useState([
    { id: 1, rollNo: '001', name: 'Aarav Sharma', present: 18, absent: 2, totalClasses: 20 },
    { id: 2, rollNo: '002', name: 'Bhavna Patel', present: 19, absent: 1, totalClasses: 20 },
    { id: 3, rollNo: '003', name: 'Chirag Desai', present: 17, absent: 3, totalClasses: 20 },
    { id: 4, rollNo: '004', name: 'Divya Nair', present: 20, absent: 0, totalClasses: 20 },
    { id: 5, rollNo: '005', name: 'Eshan Verma', present: 16, absent: 4, totalClasses: 20 }
  ]);

  // File upload states
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate attendance trend data for charts
  const generateChartData = () => {
    const periods = {
      today: [
        { name: 'Period 1', present: 18, absent: 2, attendance: 90 },
        { name: 'Period 2', present: 19, absent: 1, attendance: 95 }
      ],
      weekly: [
        { name: 'Mon', present: 18, absent: 2, attendance: 90 },
        { name: 'Tue', present: 19, absent: 1, attendance: 95 },
        { name: 'Wed', present: 17, absent: 3, attendance: 85 },
        { name: 'Thu', present: 20, absent: 0, attendance: 100 },
        { name: 'Fri', present: 18, absent: 2, attendance: 90 }
      ],
      monthly: [
        { name: 'Week 1', present: 18, absent: 2, attendance: 90 },
        { name: 'Week 2', present: 19, absent: 1, attendance: 95 },
        { name: 'Week 3', present: 17, absent: 3, attendance: 85 },
        { name: 'Week 4', present: 19, absent: 1, attendance: 95 }
      ],
      'till-date': [
        { name: 'Week 1', present: 18, absent: 2, attendance: 90 },
        { name: 'Week 2', present: 19, absent: 1, attendance: 95 },
        { name: 'Week 3', present: 17, absent: 3, attendance: 85 },
        { name: 'Week 4', present: 19, absent: 1, attendance: 95 },
        { name: 'Week 5', present: 18, absent: 2, attendance: 90 }
      ],
      semester: [
        { name: 'Month 1', present: 18, absent: 2, attendance: 90 },
        { name: 'Month 2', present: 19, absent: 1, attendance: 95 },
        { name: 'Month 3', present: 17, absent: 3, attendance: 85 },
        { name: 'Month 4', present: 19, absent: 1, attendance: 95 },
        { name: 'Month 5', present: 18, absent: 2, attendance: 90 },
        { name: 'Month 6', present: 20, absent: 0, attendance: 100 }
      ]
    };
    return periods[timePeriod] || periods.semester;
  };

  const chartData = generateChartData();

  const handleUploadSyllabus = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.txt,.docx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const validExtensions = ['.pdf', '.txt', '.docx'];
        const isValid = validTypes.includes(file.type) || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
        
        if (isValid) {
          setSyllabusFile(file);
          alert(`Syllabus file "${file.name}" uploaded successfully!`);
        } else {
          alert('Please select a valid syllabus file (.PDF, .TXT, or .DOCX)');
        }
      }
    };
    input.click();
  };

  const handleAIAnalysis = async () => {
    if (!syllabusFile) {
      alert('Please upload a syllabus file first using the "Course Details" button.');
      return;
    }

    if (isAnalyzing) {
      alert('AI analysis is already in progress. Please wait...');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Import the file parsing and AI functions dynamically
      const { parseSyllabusFile } = await import('../utils/fileParser');
      const { generateCOPOMapping } = await import('../utils/aiProvider');

      // Parse the syllabus file
      const syllabusText = await parseSyllabusFile(syllabusFile);
      
      // Generate AI analysis
      const analysisResult = await generateCOPOMapping(
        syllabusText,
        undefined, // Use default API keys
        "sambanova", // Primary model
        (status) => console.log("AI Status:", status)
      );

      // Add the syllabus text to the result for display
      analysisResult.syllabusText = syllabusText;

      // Save to database before navigating
      const analysisData = {
        course_id: course.code,
        subject_name: analysisResult.subject?.name,
        subject_code: analysisResult.subject?.code,
        course_outcomes: JSON.stringify(analysisResult.courseOutcomes || []),
        program_outcomes: JSON.stringify(analysisResult.programOutcomes || []),
        co_po_mapping: JSON.stringify(analysisResult.coPoMapping || {}),
        lectures: JSON.stringify(analysisResult.lectures || []),
        practicals: JSON.stringify(analysisResult.practicals || []),
        pbl_activities: JSON.stringify(analysisResult.pblActivities || []),
        justifications: JSON.stringify(analysisResult.justifications || {}),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check if analysis already exists
      const { data: existingData } = await supabase
        .from('ai_course_analysis')
        .select('id')
        .eq('course_id', course.code)
        .single();

      if (existingData) {
        // Update existing
        await supabase
          .from('ai_course_analysis')
          .update(analysisData)
          .eq('course_id', course.code);
      } else {
        // Insert new
        await supabase
          .from('ai_course_analysis')
          .insert([analysisData]);
      }

      // Store the course code and full analysis result in localStorage
      localStorage.setItem('currentCourseCode', course.code);
      localStorage.setItem('currentAnalysisResult', JSON.stringify(analysisResult));

      setAiAnalysisResult(analysisResult);
      // Navigate to Course Overview page after saving
      onScreenChange('courseOverview', analysisResult);
      
      console.log('AI Analysis completed successfully!');
      console.log('Subject:', analysisResult.subject);
      console.log('Course Outcomes:', analysisResult.courseOutcomes?.length || 0, 'outcomes');
      console.log('Program Outcomes:', analysisResult.programOutcomes?.length || 0, 'outcomes');
      console.log('Lectures:', analysisResult.lectures?.length || 0, 'lectures');
      console.log('Practicals:', analysisResult.practicals?.length || 0, 'practicals');
      console.log('PBL Activities:', analysisResult.pblActivities?.length || 0, 'activities');
      console.log('CO-PO Mapping:', Object.keys(analysisResult.coPoMapping || {}).length, 'mappings');
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      alert('Error analyzing syllabus: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadExcel = () => {
    alert('Excel upload functionality will be implemented');
  };

  const avgAttendance = students.length > 0 
    ? Math.round((students.reduce((sum, s) => sum + s.present, 0) / (students.length * 20)) * 100)
    : 0;

  return (
    <div className="course-management-wrapper">
      <Navbar facultyName="Dr. Raj Kumar" onScreenChange={onScreenChange} />
      <div className="course-management">
        <main className="course-management-main">
          <div className="back-button-container">
            <button className="back-button" onClick={onBack}>← Back</button>
          </div>

          <div className="top-actions">
            <button className="delete-course-btn" onClick={() => onDeleteCourse(course.id)}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </div>

          <div className="course-header-section">
            <h1>{course?.name || 'New Course'}</h1>
            <p className="course-code-info">{course?.code || 'Code'} | {course?.department} | Semester {course?.semester} | Division {course?.division}</p>
          </div>

          <div className="course-actions">
            <button className="action-btn course-details-btn" onClick={handleUploadSyllabus}>
              <FontAwesomeIcon icon={faBook} className="btn-icon" />
              <span>Course Details (PDF)</span>
            </button>
            <button className="action-btn add-students-btn" onClick={handleUploadExcel}>
              <FontAwesomeIcon icon={faPlus} className="btn-icon" />
              <span>Add Students (Excel)</span>
            </button>
            <button 
              className="action-btn course-overview-btn" 
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
            >
              <FontAwesomeIcon icon={faBook} className="btn-icon" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Course Overview'}</span>
            </button>
          </div>

              <div className="attendance-analysis-section">
                <h2>Attendance Analysis</h2>

                {/* Summary Metrics */}
                <div className="attendance-summary">
                  <div className="summary-card">
                    <div className="summary-value">{students.length}</div>
                    <div className="summary-label">Total Students</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-value">{Math.round((students.reduce((sum, s) => sum + s.present, 0) / (students.length * 20)) * 100)}%</div>
                    <div className="summary-label">Average Attendance</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-value">{students.length * 20}</div>
                    <div className="summary-label">Total Lectures</div>
                  </div>
                </div>

                {/* Whole Class Attendance Analysis */}
                <div className="whole-class-section">
                  <h3>Whole Class Attendance Analysis</h3>

                  <div className="filter-buttons">
                    {[
                      { key: 'today', label: 'Today' },
                      { key: 'weekly', label: 'Weekly' },
                      { key: 'monthly', label: 'Monthly' },
                      { key: 'till-date', label: 'Till Current Date' },
                      { key: 'semester', label: 'Full Semester' }
                    ].map((period) => (
                      <button
                        key={period.key}
                        className={`filter-btn ${timePeriod === period.key ? 'active' : ''}`}
                        onClick={() => setTimePeriod(period.key)}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>

                  <div className="chart-container-wrapper">
                    <div className="chart-item">
                      <h4>Attendance Trend</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={generateChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="attendance" stroke="#64b5f6" strokeWidth={2} name="Attendance %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-item">
                      <h4>Present vs Absent</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={generateChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="present" fill="#2e7d32" name="Present" />
                          <Bar dataKey="absent" fill="#f44336" name="Absent" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="attendance-table-section">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Total Classes</th>
                        <th>Attendance %</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => {
                        const attendancePercent = Math.round((student.present / student.totalClasses) * 100);
                        const status = attendancePercent >= 75 ? 'Present' : 'Absent';
                        return (
                          <tr key={student.id}>
                            <td>{student.rollNo}</td>
                            <td>{student.name}</td>
                            <td className="present-count">{student.present}</td>
                            <td className="absent-count">{student.absent}</td>
                            <td>{student.totalClasses}</td>
                            <td><strong>{attendancePercent}%</strong></td>
                            <td>
                              <span className={`status-badge ${status.toLowerCase()}`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
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

export default Dashboard;
