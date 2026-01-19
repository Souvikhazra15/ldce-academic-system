-- =====================================================
-- LDCE IAS (Integrated Academic System) Database Schema
-- Academic Management System
-- =====================================================

-- =====================================================
-- 1. CORE USERS & STAFF
-- =====================================================
CREATE TABLE User_staff (
    staff_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    department_id VARCHAR(50),
    designation VARCHAR(50),
    date_of_joining DATE,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. ACADEMIC STRUCTURE
-- =====================================================
CREATE TABLE Department (
    dept_id VARCHAR(50) PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    dept_head_id VARCHAR(50),
    created_at TIMESTAMP,
    FOREIGN KEY (dept_head_id) REFERENCES User_staff(staff_id)
);

CREATE TABLE Program (
    program_id VARCHAR(50) PRIMARY KEY,
    program_name VARCHAR(100) NOT NULL,
    program_code VARCHAR(20),
    dept_id VARCHAR(50),
    duration_years INT,
    created_at TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
);

CREATE TABLE Course (
    course_id VARCHAR(50) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20),
    program_id VARCHAR(50),
    semester INT,
    credits INT,
    total_units INT,
    created_at TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES Program(program_id)
);

-- =====================================================
-- 3. FACULTY & COURSE ASSIGNMENT
-- =====================================================
CREATE TABLE Faculty_Posts (
    faculty_post_id VARCHAR(50) PRIMARY KEY,
    staff_id VARCHAR(50),
    course_id VARCHAR(50),
    academic_year VARCHAR(10),
    semester INT,
    status VARCHAR(20),
    assigned_date DATE,
    created_at TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES User_staff(staff_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

CREATE TABLE Subject_Posts (
    subject_post_id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50),
    subject_name VARCHAR(100),
    subject_code VARCHAR(20),
    total_lectures INT,
    total_practicals INT,
    total_tutorials INT,
    created_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

-- =====================================================
-- 4. COURSE OUTCOMES & MAPPING
-- =====================================================
CREATE TABLE Course_Outcome (
    co_id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50),
    co_number INT,
    co_statement TEXT,
    co_domain VARCHAR(50),
    co_level INT,
    created_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

CREATE TABLE PO (
    po_id VARCHAR(50) PRIMARY KEY,
    po_number INT,
    po_statement TEXT,
    po_domain VARCHAR(50),
    created_at TIMESTAMP
);

CREATE TABLE CO_PO_Mapping (
    mapping_id VARCHAR(50) PRIMARY KEY,
    co_id VARCHAR(50),
    po_id VARCHAR(50),
    proficiency_level INT,
    created_at TIMESTAMP,
    FOREIGN KEY (co_id) REFERENCES Course_Outcome(co_id),
    FOREIGN KEY (po_id) REFERENCES PO(po_id)
);

-- =====================================================
-- 5. LECTURE PLANNING & SCHEDULE
-- =====================================================
CREATE TABLE Lecture_Planning (
    lecture_id VARCHAR(50) PRIMARY KEY,
    faculty_post_id VARCHAR(50),
    unit_number INT,
    topic_name VARCHAR(200),
    lecture_date DATE,
    lecture_time TIME,
    duration_minutes INT,
    co_id VARCHAR(50),
    teaching_methods VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (faculty_post_id) REFERENCES Faculty_Posts(faculty_post_id),
    FOREIGN KEY (co_id) REFERENCES Course_Outcome(co_id)
);

CREATE TABLE Schedule_Meeting (
    meeting_id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50),
    meeting_date DATE,
    meeting_time TIME,
    meeting_type VARCHAR(50),
    topic VARCHAR(200),
    attendees TEXT,
    notes TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

-- =====================================================
-- 6. STUDENTS & ENROLLMENT
-- =====================================================
CREATE TABLE Student_Record (
    student_id VARCHAR(50) PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    enrollment_number VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(15),
    program_id VARCHAR(50),
    semester INT,
    batch_year INT,
    admission_date DATE,
    status VARCHAR(20),
    created_at TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES Program(program_id)
);

CREATE TABLE Course_Enrollment (
    enrollment_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50),
    course_id VARCHAR(50),
    academic_year VARCHAR(10),
    semester INT,
    enrollment_date DATE,
    status VARCHAR(20),
    created_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Student_Record(student_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

-- =====================================================
-- 7. ATTENDANCE & PARTICIPATION
-- =====================================================
CREATE TABLE Attendance_Item (
    attendance_id VARCHAR(50) PRIMARY KEY,
    lecture_id VARCHAR(50),
    student_id VARCHAR(50),
    attendance_status VARCHAR(20),
    marked_date DATE,
    created_at TIMESTAMP,
    FOREIGN KEY (lecture_id) REFERENCES Lecture_Planning(lecture_id),
    FOREIGN KEY (student_id) REFERENCES Student_Record(student_id)
);

CREATE TABLE PA_Ratings (
    pa_rating_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50),
    course_id VARCHAR(50),
    participation_percentage DECIMAL(5, 2),
    attitude_score INT,
    attainment_rating INT,
    faculty_post_id VARCHAR(50),
    academic_year VARCHAR(10),
    semester INT,
    rating_date DATE,
    created_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Student_Record(student_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (faculty_post_id) REFERENCES Faculty_Posts(faculty_post_id)
);

-- =====================================================
-- 8. ASSESSMENT & EVALUATION
-- =====================================================
CREATE TABLE Assessment (
    assessment_id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50),
    faculty_post_id VARCHAR(50),
    assessment_type VARCHAR(50),
    assessment_title VARCHAR(200),
    assessment_date DATE,
    total_marks INT,
    co_id VARCHAR(50),
    created_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (faculty_post_id) REFERENCES Faculty_Posts(faculty_post_id),
    FOREIGN KEY (co_id) REFERENCES Course_Outcome(co_id)
);

CREATE TABLE Assessment_Marks (
    marks_id VARCHAR(50) PRIMARY KEY,
    assessment_id VARCHAR(50),
    student_id VARCHAR(50),
    marks_obtained DECIMAL(5, 2),
    remarks TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES Assessment(assessment_id),
    FOREIGN KEY (student_id) REFERENCES Student_Record(student_id)
);

CREATE TABLE Assessment_Grading (
    grading_id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50),
    student_id VARCHAR(50),
    internal_marks DECIMAL(5, 2),
    external_marks DECIMAL(5, 2),
    total_marks DECIMAL(5, 2),
    grade VARCHAR(5),
    academic_year VARCHAR(10),
    semester INT,
    created_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (student_id) REFERENCES Student_Record(student_id)
);

-- =====================================================
-- 9. CO ATTAINMENT
-- =====================================================
CREATE TABLE CO_Attainment (
    attainment_id VARCHAR(50) PRIMARY KEY,
    co_id VARCHAR(50),
    course_id VARCHAR(50),
    direct_assessment_percentage DECIMAL(5, 2),
    indirect_assessment_percentage DECIMAL(5, 2),
    total_attainment_percentage DECIMAL(5, 2),
    target_percentage DECIMAL(5, 2),
    status VARCHAR(20),
    academic_year VARCHAR(10),
    semester INT,
    created_at TIMESTAMP,
    FOREIGN KEY (co_id) REFERENCES Course_Outcome(co_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

CREATE TABLE PO_Attainment (
    po_attainment_id VARCHAR(50) PRIMARY KEY,
    po_id VARCHAR(50),
    program_id VARCHAR(50),
    attainment_percentage DECIMAL(5, 2),
    target_percentage DECIMAL(5, 2),
    status VARCHAR(20),
    academic_year VARCHAR(10),
    created_at TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES PO(po_id),
    FOREIGN KEY (program_id) REFERENCES Program(program_id)
);

-- =====================================================
-- 10. REPORTS & ANALYTICS
-- =====================================================
CREATE TABLE Report_Template (
    report_id VARCHAR(50) PRIMARY KEY,
    report_name VARCHAR(100),
    report_type VARCHAR(50),
    description TEXT,
    query_definition TEXT,
    created_by VARCHAR(50),
    created_at TIMESTAMP
);

CREATE TABLE CO_Unit_Mapping (
    mapping_id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50),
    co_id VARCHAR(50),
    unit_number INT,
    created_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (co_id) REFERENCES Course_Outcome(co_id)
);

CREATE TABLE Exam_Paper_Support (
    exam_paper_id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50),
    exam_date DATE,
    exam_type VARCHAR(50),
    total_questions INT,
    co_mapping TEXT,
    difficulty_level VARCHAR(20),
    created_by VARCHAR(50),
    created_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

-- =====================================================
-- 11. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_faculty_course ON Faculty_Posts(course_id, academic_year);
CREATE INDEX idx_student_enrollment ON Course_Enrollment(student_id, course_id);
CREATE INDEX idx_attendance ON Attendance_Item(student_id, lecture_id);
CREATE INDEX idx_assessment ON Assessment(course_id, assessment_type);
CREATE INDEX idx_lecture_planning ON Lecture_Planning(faculty_post_id, lecture_date);
CREATE INDEX idx_co_attainment ON CO_Attainment(course_id, academic_year);

-- =====================================================
-- DATABASE SCHEMA COMPLETE
-- =====================================================
