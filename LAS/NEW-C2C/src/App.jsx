import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CourseOverview from './pages/CourseOverview';
import COUnitMappingSetup from './pages/COUnitMappingSetup';
import AttendanceEntry from './pages/AttendanceEntry';
import AssessmentEntry from './pages/AssessmentEntry';
import ExamPaperSupport from './pages/ExamPaperSupport';
import COPOAttainmentView from './pages/COPOAttainmentView';
import ReportGenerationScreen from './pages/ReportGenerationScreen';
import AcademicRepository from './pages/AcademicRepository';
import ProfilePage from './pages/ProfilePage';
import LecturePlanning from './pages/LecturePlanning';
// HoD Pages
import HODDashboard from './pages/HODDashboard';
import StudentData from './pages/StudentData';
import AccessControl from './pages/AccessControl';
import FacultyMapping from './pages/FacultyMapping';
import ReportViewer from './pages/ReportViewer';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [facultyData, setFacultyData] = React.useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('facultyAuth');
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        setFacultyData(auth);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to restore authentication:', err);
        localStorage.removeItem('facultyAuth');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setFacultyData(data);
    setIsAuthenticated(true);
    // Navigate based on user role
    const dashboardPath = data.role === 'hod' ? '/hod-dashboard' : '/dashboard';
    navigate(dashboardPath);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setFacultyData(null);
    localStorage.removeItem('facultyAuth');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleRoleSwitch = (newRole) => {
    if (facultyData) {
      const updatedData = { ...facultyData, role: newRole };
      setFacultyData(updatedData);
      localStorage.setItem('facultyAuth', JSON.stringify(updatedData));
      const dashboardPath = newRole === 'hod' ? '/hod-dashboard' : '/dashboard';
      navigate(dashboardPath);
    }
  };

  const handleScreenChange = (screenId) => {
    const pathMap = {
      dashboard: '/dashboard',
      attendanceEntry: '/attendance',
      assessmentEntry: '/assessment',
      coPOAttainmentView: '/co-po-view',
      reportGenerationScreen: '/report',
      profile: '/profile',
      courseOverview: '/course-overview',
      coUnitMappingSetup: '/co-unit-mapping',
      examPaperSupport: '/exam-paper-support',
      academicRepository: '/academic-repository',
      lecturePlanning: '/lecture-planning',
      // HoD routes
      hodDashboard: '/hod-dashboard',
      studentData: '/student-data',
      accessControl: '/access-control',
      facultyMapping: '/faculty-mapping',
      reportViewer: '/report-viewer'
    };
    navigate(pathMap[screenId] || '/dashboard');
  };

  // Always render routes
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={facultyData?.role === 'hod' ? '/hod-dashboard' : '/dashboard'} replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
      {isAuthenticated && facultyData?.role === 'faculty' && (
        <>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard currentScreen="dashboard" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/profile" element={<ProfilePage currentScreen="profile" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/course-overview" element={<CourseOverview currentScreen="courseOverview" courseId="CS101" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/co-unit-mapping" element={<COUnitMappingSetup currentScreen="coUnitMappingSetup" courseId="CS101" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/attendance" element={<AttendanceEntry currentScreen="attendanceEntry" courseId="CS101" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/assessment" element={<AssessmentEntry currentScreen="assessmentEntry" courseId="CS101" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/exam-paper-support" element={<ExamPaperSupport currentScreen="examPaperSupport" courseId="CS101" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/co-po-view" element={<COPOAttainmentView currentScreen="coPOAttainmentView" courseId="CS101" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/report" element={<ReportGenerationScreen currentScreen="reportGenerationScreen" courseId="CS101" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/academic-repository" element={<AcademicRepository currentScreen="academicRepository" courseId="CS101" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
          <Route path="/lecture-planning" element={<LecturePlanning currentScreen="lecturePlanning" courseId="CS101" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
        </>
      )}
      {isAuthenticated && facultyData?.role === 'hod' && (
        <>
          <Route path="/" element={<Navigate to="/hod-dashboard" replace />} />
          <Route path="/hod-dashboard" element={<HODDashboard currentScreen="hodDashboard" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} onRoleSwitch={handleRoleSwitch} />} />
          <Route path="/student-data" element={<StudentData currentScreen="studentData" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} onRoleSwitch={handleRoleSwitch} />} />
          <Route path="/access-control" element={<AccessControl currentScreen="accessControl" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} onRoleSwitch={handleRoleSwitch} />} />
          <Route path="/faculty-mapping" element={<FacultyMapping currentScreen="facultyMapping" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} onRoleSwitch={handleRoleSwitch} />} />
          <Route path="/report-viewer" element={<ReportViewer currentScreen="reportViewer" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} onRoleSwitch={handleRoleSwitch} />} />
          <Route path="/profile" element={<ProfilePage currentScreen="profile" onScreenChange={handleScreenChange} facultyData={facultyData} onLogout={handleLogout} />} />
        </>
      )}
      {isAuthenticated && facultyData?.role && (
        <Route path="/*" element={<Navigate to={facultyData.role === 'hod' ? '/hod-dashboard' : '/dashboard'} replace />} />
      )}
      {isAuthenticated && !facultyData?.role && (
        <Route path="/*" element={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>} />
      )}
      {!isAuthenticated && <Route path="/*" element={<Navigate to="/login" replace />} />}
    </Routes>
  );
}

export default App;
