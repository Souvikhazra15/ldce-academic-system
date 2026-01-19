import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faPaperPlane, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AttendanceEntry.css';
import { formatCourseLabel } from '../utils/courseFormatter';

const AttendanceEntry = ({ currentScreen, courseId = 'CS101', onScreenChange, facultyData, onLogout }) => {
  // Mock data - will be replaced with API calls
  const mockCourses = [
    { 
      id: 'CS101', 
      name: 'Data Structures', 
      code: '3137001',
      abbr: 'DS',
      department: 'IT',
      semester: 3,
      division: 'B1',
      classes: ['B1', 'B2'] 
    },
    { 
      id: 'CS102', 
      name: 'Web Development', 
      code: '3137002',
      abbr: 'WD',
      department: 'IT',
      semester: 3,
      division: 'B2',
      classes: ['A1', 'A2'] 
    }
  ];

  const mockStudents = useMemo(() => [
    { rollNo: '001', name: 'Aarav Sharma', isPresent: null },
    { rollNo: '002', name: 'Bhavna Patel', isPresent: null },
    { rollNo: '003', name: 'Chirag Desai', isPresent: null },
    { rollNo: '004', name: 'Divya Nair', isPresent: null },
    { rollNo: '005', name: 'Eshan Verma', isPresent: null },
    { rollNo: '006', name: 'Fiona Gupta', isPresent: null },
    { rollNo: '007', name: 'Gaurav Singh', isPresent: null },
    { rollNo: '008', name: 'Hana Khan', isPresent: null },
  ], []);

  // State Management
  const [selectedCourse, setSelectedCourse] = useState(courseId);
  const [selectedClass, setSelectedClass] = useState('B1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [lectureNo, setLectureNo] = useState('1');
  const [students, setStudents] = useState(mockStudents);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // BLE Attendance State
  const [sessionActive, setSessionActive] = useState(false);
  const [bleScannedStudents, setBleScannedStudents] = useState([]);
  const [sessionResponseCount, setSessionResponseCount] = useState(0);

  useEffect(() => {
    // Placeholder for API call to fetch students
    // const fetchStudents = async () => {
    //   try {
    //     const response = await fetch(
    //       `/api/courses/${selectedCourse}/classes/${selectedClass}/students`
    //     );
    //     const data = await response.json();
    //     setStudents(data.map(student => ({ ...student, isPresent: null })));
    //   } catch (err) {
    //     console.error('Error fetching students:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchStudents();

    setLoading(false);
  }, [selectedCourse, selectedClass]);

  // BLE Session Handlers
  const handleStartSession = () => {
    setSessionActive(true);
    setBleScannedStudents([]);
    setSessionResponseCount(0);
  };

  const handleStopSession = () => {
    setSessionActive(false);
    // Auto-mark students from BLE scan as present
    if (bleScannedStudents.length > 0) {
      setStudents((prev) =>
        prev.map((student) =>
          bleScannedStudents.includes(student.rollNo)
            ? { ...student, isPresent: true }
            : student
        )
      );
    }
  };

  // Simulate BLE scanning - in real implementation, this would come from BLE device
  const simulateBLEScan = useCallback(() => {
    if (sessionActive && bleScannedStudents.length < mockStudents.length) {
      const unscannedStudents = mockStudents.filter(
        (s) => !bleScannedStudents.includes(s.rollNo)
      );
      if (unscannedStudents.length > 0) {
        const randomStudent =
          unscannedStudents[Math.floor(Math.random() * unscannedStudents.length)];
        const newScannedList = [...bleScannedStudents, randomStudent.rollNo];
        setBleScannedStudents(newScannedList);
        setSessionResponseCount(newScannedList.length);
      }
    }
  }, [sessionActive, bleScannedStudents, mockStudents]);

  useEffect(() => {
    if (sessionActive) {
      // Simulate BLE scanning every 2 seconds when session is active
      const interval = setInterval(simulateBLEScan, 2000);
      return () => clearInterval(interval);
    }
  }, [sessionActive, bleScannedStudents, simulateBLEScan]);

  const handleAttendanceToggle = (rollNo) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.rollNo === rollNo
          ? {
              ...student,
              isPresent: student.isPresent === true ? false : student.isPresent === false ? null : true
            }
          : student
      )
    );
    setSuccessMessage('');
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, isPresent: true }))
    );
  };

  const handleMarkAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, isPresent: false }))
    );
  };

  const handleQRScan = () => {
    console.log('QR Scan clicked');
    // Will integrate: open QR scanner modal
    // setShowQRScanner(true);
    alert('QR Scanner integration coming soon');
  };

  const handleSubmitAttendance = async () => {
    // Validate that all students have attendance marked
    const unmarked = students.filter((s) => s.isPresent === null);
    if (unmarked.length > 0) {
      alert(`Please mark attendance for all students. ${unmarked.length} unmarked.`);
      return;
    }

    setSubmitting(true);
    try {
      // Prepare attendance data
      const attendanceData = {
        id: `${selectedCourse}_${selectedClass}_${selectedDate}_${lectureNo}`,
        courseId: selectedCourse,
        courseName: currentCourse?.name || selectedCourse,
        className: selectedClass,
        date: selectedDate,
        lectureNo: parseInt(lectureNo),
        timestamp: new Date().toISOString(),
        attendance: students.map((student) => ({
          rollNo: student.rollNo,
          name: student.name,
          isPresent: student.isPresent
        }))
      };

      // Save to localStorage
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      // Remove duplicate if exists
      const filtered = existingRecords.filter(r => r.id !== attendanceData.id);
      filtered.push(attendanceData);
      localStorage.setItem('attendanceRecords', JSON.stringify(filtered));

      console.log('Attendance submitted:', attendanceData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      setSuccessMessage('✓ Attendance submitted successfully!');
      
      // Reset form after success
      setTimeout(() => {
        setSuccessMessage('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setLectureNo('1');
        setStudents(mockStudents.map(s => ({ ...s, isPresent: null })));
      }, 2000);
    } catch (err) {
      console.error('Error submitting attendance:', err);
      alert('Error submitting attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = students.filter((s) => s.isPresent === true).length;
  const absentCount = students.filter((s) => s.isPresent === false).length;
  const unmarkedCount = students.filter((s) => s.isPresent === null).length;

  const currentCourse = mockCourses.find((c) => c.id === selectedCourse);

  return (
    <div className="attendance-entry-wrapper">
      <Navbar facultyName={facultyData?.name || 'Dr. Raj Kumar'} currentScreen={currentScreen} onScreenChange={onScreenChange} onLogout={onLogout} />
      <div className="attendance-entry">
        <div className="attendance-main">
          {/* Page Header */}
          <div className="attendance-header">
            <h1>Attendance Entry</h1>
          </div>

          {/* Content Card */}
          <div className="attendance-content-card">
            <div className="attendance-container">
              {/* Selection Panel */}
        <div className="selection-panel">
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

          <div className="selection-group">
            <label htmlFor="class-select">Class</label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="select-input"
            >
              {currentCourse?.classes.map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="selection-group">
            <label htmlFor="date-input">Date</label>
            <input
              id="date-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="select-input"
            />
          </div>

          <div className="selection-group">
            <label htmlFor="lecture-input">Lecture No.</label>
            <input
              id="lecture-input"
              type="number"
              min="1"
              max="10"
              value={lectureNo}
              onChange={(e) => setLectureNo(e.target.value)}
              className="select-input"
            />
          </div>
        </div>

              {/* BLE Attendance Section */}
              <div className="ble-attendance-section">
                <div className="ble-session-box">
                  <div className="ble-session-left">
                    <div className="ble-status-item">
                      <div className="ble-status-label">Session Status</div>
                      <div className="ble-status-text">
                        {sessionActive
                          ? `Session active (${sessionResponseCount} responses)`
                          : 'No active session.'}
                      </div>
                    </div>
                  </div>

                  <div className="ble-session-right">
                    <div className="ble-status-item">
                      <div className="ble-status-label">Actions</div>
                      <button
                        className={`ble-session-btn ${sessionActive ? 'stop-btn' : 'start-btn'}`}
                        onClick={sessionActive ? handleStopSession : handleStartSession}
                      >
                        {sessionActive ? 'Stop Session' : 'Start Session'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Received Enrollments */}
                <div className="ble-enrollments-box">
                  <h3 className="ble-enrollments-title">Received Enrollments</h3>
                  <div className="ble-enrollments-list">
                    {bleScannedStudents.length > 0 ? (
                      bleScannedStudents.map((rollNo) => {
                        return (
                          <div key={rollNo} className="ble-enrollment-item">
                            <span className="ble-enrollment-roll">{rollNo}</span>
                            <span className="ble-enrollment-status">Present</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="ble-waiting-message">
                        {sessionActive
                          ? 'Waiting for students to respond...'
                          : 'Waiting for students to respond...'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="section-divider"></div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item present">
            <span className="stat-label">Present:</span>
            <span className="stat-value">{presentCount}</span>
          </div>
          <div className="stat-item absent">
            <span className="stat-label">Absent:</span>
            <span className="stat-value">{absentCount}</span>
          </div>
          <div className="stat-item unmarked">
            <span className="stat-label">Unmarked:</span>
            <span className="stat-value">{unmarkedCount}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            className="action-btn mark-all-present"
            onClick={handleMarkAllPresent}
            title="Mark all students present"
          >
            Mark All Present
          </button>
          <button
            className="action-btn mark-all-absent"
            onClick={handleMarkAllAbsent}
            title="Mark all students absent"
          >
            Mark All Absent
          </button>
          <button
            className="action-btn qr-scan-btn"
            onClick={handleQRScan}
            title="Scan QR code"
          >
            <FontAwesomeIcon icon={faQrcode} />
            <span>QR Scan</span>
          </button>
        </div>

        {/* Students Table */}
        {loading ? (
          <div className="loading">Loading students...</div>
        ) : (
          <div className="table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th className="roll-header">Roll No</th>
                  <th className="name-header">Student Name</th>
                  <th className="status-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.rollNo} className="student-row">
                    <td className="roll-col">{student.rollNo}</td>
                    <td className="name-col">{student.name}</td>
                    <td className="status-col">
                      <button
                        className={`status-toggle ${
                          student.isPresent === true
                            ? 'present'
                            : student.isPresent === false
                            ? 'absent'
                            : 'unmarked'
                        }`}
                        onClick={() => handleAttendanceToggle(student.rollNo)}
                        title="Click to toggle attendance"
                      >
                        <FontAwesomeIcon
                          icon={
                            student.isPresent === true
                              ? faCheckCircle
                              : student.isPresent === false
                              ? faTimesCircle
                              : faCheckCircle
                          }
                        />
                        <span>
                          {student.isPresent === true
                            ? 'Present'
                            : student.isPresent === false
                            ? 'Absent'
                            : 'Mark'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Submit Section */}
        <div className="submit-section">
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          <button
            className="submit-btn"
            onClick={handleSubmitAttendance}
            disabled={submitting || unmarkedCount > 0}
            title={unmarkedCount > 0 ? 'Please mark all students first' : 'Submit attendance'}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>{submitting ? 'Submitting...' : 'Submit Attendance'}</span>
          </button>
            </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AttendanceEntry;
