# Subject/Course Management API - Quick Start Guide

## Overview

This implementation provides a complete RESTful API for managing subjects/courses in the LDCE Academic System. Faculty members can create, read, update, and delete courses that are automatically stored in the Prisma database.

## 🎯 What's Been Implemented

### ✅ Backend Components

1. **Controller**: `src/controllers/subjectController.js`
   - Create subject
   - Get all subjects (with search & filters)
   - Get subject by ID
   - Update subject
   - Delete subject  
   - Get statistics

2. **Routes**: `src/routes/subjectRoutes.js`
   - All endpoints with role-based authorization
   - Faculty can CREATE, READ, UPDATE
   - HOD/ADMIN can DELETE
   - Students can only READ

3. **Server Integration**: `src/server.js`
   - Routes registered at `/api/subjects`
   - Automatically synced with existing backend structure

### ✅ Database Integration

- **Model**: Uses existing `Subject` schema from Prisma
- **Auto-sync**: All changes reflect in Prisma Studio immediately
- **Relations**: Fully integrated with CurriculumMapping, CourseOutcome, etc.

### ✅ Documentation & Testing

- **API Docs**: `SUBJECT_API_DOCS.md` - Complete API reference
- **Postman Collection**: `Subject_API_Collection.postman_collection.json`
- **Test Script**: `test-subject-api.js` - Automated testing

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm start
# or
.\start-server.bat
```

The server will run on `http://localhost:5000`

### 2. Create a Faculty User (First Time Only)

If you don't have a faculty user, create one:

**Using Prisma Studio:**
```bash
npm run studio
# or
.\start-prisma-studio.bat
```

Navigate to the `users` table and create a user with `role: FACULTY`

**Or using the API:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "faculty@ldce.ac.in",
    "password": "Faculty@123",
    "fullName": "Dr. John Doe",
    "role": "FACULTY",
    "phone": "1234567890"
  }'
```

### 3. Test the Subject API

**Option A: Run Automated Tests**
```bash
node test-subject-api.js
```

**Option B: Use Postman**
1. Import `Subject_API_Collection.postman_collection.json`
2. Update collection variables if needed
3. Run "Login as Faculty" first
4. Then run other requests

**Option C: Manual Testing with cURL**
```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "faculty@ldce.ac.in", "password": "Faculty@123"}'

# Save the accessToken from response

# 2. Create a subject
curl -X POST http://localhost:5000/api/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Web Development",
    "code": "CS102",
    "credits": 3,
    "isElective": false
  }'

# 3. Get all subjects
curl http://localhost:5000/api/subjects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Verify in Prisma Studio

```bash
npm run studio
```

Navigate to the `subjects` table to see all created courses.

## 📋 API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/subjects` | Faculty+ | Create subject |
| GET | `/api/subjects` | All | Get all subjects |
| GET | `/api/subjects/:id` | All | Get subject by ID |
| PUT | `/api/subjects/:id` | Faculty+ | Update subject |
| DELETE | `/api/subjects/:id` | HOD+ | Delete subject |
| GET | `/api/subjects/stats` | Faculty+ | Get statistics |

**Access Levels:**
- All: STUDENT, FACULTY, HOD, ADMIN
- Faculty+: FACULTY, HOD, ADMIN
- HOD+: HOD, ADMIN

## 🔑 Authentication & Authorization

### How It Works

1. **Login** to get JWT token
2. **Include token** in Authorization header: `Bearer YOUR_TOKEN`
3. **Role check** happens automatically based on user's role

### Faculty Credentials

Faculty users (with role `FACULTY`, `HOD`, or `ADMIN`) can:
- ✅ Create new courses
- ✅ View all courses
- ✅ Update course details
- ✅ View statistics
- ❌ Delete courses (HOD/ADMIN only)

## 📊 Database Schema

```prisma
model Subject {
  id              String    @id @default(uuid())
  name            String    // e.g., "Data Structures"
  code            String    @unique // e.g., "CS101"
  credits         Int       // e.g., 4
  isElective      Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Automatic relations with other tables
  curriculumMappings CurriculumMapping[]
  courseOutcomes     CourseOutcome[]
  lecturePlans       LecturePlan[]
  assessments        Assessment[]
  attendanceSessions AttendanceSession[]
}
```

## 🎨 Frontend Integration Example

### React Component Example

```jsx
import { useState, useEffect } from 'react';

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    credits: 3,
    isElective: false
  });

  const token = localStorage.getItem('accessToken');

  // Fetch courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const response = await fetch('http://localhost:5000/api/subjects', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.success) {
      setCourses(data.data.subjects);
    }
  };

  // Create course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:5000/api/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newCourse)
    });

    const data = await response.json();
    if (data.success) {
      alert('Course created successfully!');
      fetchCourses(); // Refresh list
      setNewCourse({ name: '', code: '', credits: 3, isElective: false });
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div>
      <h2>Create New Course</h2>
      <form onSubmit={handleCreateCourse}>
        <input
          placeholder="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
        />
        <input
          placeholder="Course Code"
          value={newCourse.code}
          onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
        />
        <input
          type="number"
          placeholder="Credits"
          value={newCourse.credits}
          onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
        />
        <label>
          <input
            type="checkbox"
            checked={newCourse.isElective}
            onChange={(e) => setNewCourse({...newCourse, isElective: e.target.checked})}
          />
          Elective
        </label>
        <button type="submit">Create Course</button>
      </form>

      <h2>Existing Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {course.name} ({course.code}) - {course.credits} credits
            {course.isElective && ' [Elective]'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseManagement;
```

## 📝 Usage Examples

### Create a Core Subject
```json
POST /api/subjects
{
  "name": "Data Structures",
  "code": "CS101",
  "credits": 4,
  "isElective": false
}
```

### Create an Elective Subject
```json
POST /api/subjects
{
  "name": "Machine Learning",
  "code": "CS401E",
  "credits": 3,
  "isElective": true
}
```

### Search for Subjects
```
GET /api/subjects?search=data
GET /api/subjects?isElective=true
GET /api/subjects?search=web&page=1&limit=10
```

### Update a Subject
```json
PUT /api/subjects/{id}
{
  "credits": 5,
  "name": "Advanced Data Structures"
}
```

## ⚠️ Important Notes

1. **Unique Codes**: Each subject must have a unique code
2. **Delete Protection**: Cannot delete subjects with existing:
   - Curriculum mappings
   - Course outcomes
   - Lecture plans
   - Assessments
   - Attendance sessions

3. **Role Requirements**:
   - Creating/updating requires FACULTY role or higher
   - Deleting requires HOD or ADMIN role

4. **Validation**:
   - Name, code, and credits are required
   - Credits must be a positive number
   - Code cannot be duplicated

## 🔧 Troubleshooting

### Server won't start
```bash
# Check if dependencies are installed
npm install

# Check if .env file exists
copy .env.example .env

# Ensure Prisma is generated
npm run generate
```

### Authentication fails
- Ensure you have a user with FACULTY role
- Check that password meets requirements
- Verify JWT secret is set in .env

### Cannot create subjects
- Check user role is FACULTY, HOD, or ADMIN
- Verify token is included in Authorization header
- Check for duplicate subject codes

## 📚 Additional Resources

- **Full API Documentation**: `SUBJECT_API_DOCS.md`
- **Postman Collection**: `Subject_API_Collection.postman_collection.json`
- **Test Script**: `test-subject-api.js`
- **Architecture**: `ARCHITECTURE.md`
- **Setup Guide**: `SETUP_COMPLETE.md`

## 🎯 Next Steps

1. **Frontend Integration**: 
   - Create UI for course management
   - Add to "Add Courses" button in Dashboard
   - Implement search and filter interface

2. **Enhanced Features**:
   - Bulk upload via Excel
   - Course prerequisites
   - Department-wise filtering
   - Semester-wise grouping

3. **Additional APIs**:
   - Link courses to curriculum
   - Assign faculty to courses
   - Student enrollment

## 💡 Support

If you encounter any issues:
1. Check the console for error messages
2. Review `SUBJECT_API_DOCS.md` for details
3. Test with Postman collection
4. Verify database schema in Prisma Studio

---

**Ready to use!** 🚀 The API is fully functional and integrated with your existing backend infrastructure.
