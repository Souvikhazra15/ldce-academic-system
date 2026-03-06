# Subject/Course Management API Documentation

## Overview
This API allows faculty members to create and manage subjects/courses in the system. The data is stored in the Prisma database according to the Subject schema.

## Base URL
```
http://localhost:5000/api/subjects
```

## Authentication
All endpoints require JWT authentication via Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Create Subject
**POST** `/api/subjects`

**Access:** FACULTY, HOD, ADMIN

**Request Body:**
```json
{
  "name": "Data Structures",
  "code": "CS101",
  "credits": 4,
  "isElective": false
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Subject created successfully",
  "data": {
    "id": "uuid-here",
    "name": "Data Structures",
    "code": "CS101",
    "credits": 4,
    "isElective": false,
    "createdAt": "2026-03-06T10:00:00.000Z",
    "updatedAt": "2026-03-06T10:00:00.000Z"
  }
}
```

**Error Responses:**
- 400: Missing required fields or invalid data
- 401: Not authenticated
- 403: Insufficient permissions (not FACULTY/HOD/ADMIN)
- 409: Subject code already exists

---

### 2. Get All Subjects
**GET** `/api/subjects`

**Access:** FACULTY, STUDENT, HOD, ADMIN

**Query Parameters:**
- `isElective` (optional): Filter by elective status (true/false)
- `search` (optional): Search in name or code
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50): Items per page

**Example:**
```
GET /api/subjects?search=data&page=1&limit=10
GET /api/subjects?isElective=true
```

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "subjects": [
      {
        "id": "uuid-here",
        "name": "Data Structures",
        "code": "CS101",
        "credits": 4,
        "isElective": false,
        "createdAt": "2026-03-06T10:00:00.000Z",
        "updatedAt": "2026-03-06T10:00:00.000Z",
        "_count": {
          "curriculumMappings": 2,
          "courseOutcomes": 5,
          "assessments": 3
        }
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    }
  }
}
```

---

### 3. Get Subject by ID
**GET** `/api/subjects/:id`

**Access:** FACULTY, STUDENT, HOD, ADMIN

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Data Structures",
    "code": "CS101",
    "credits": 4,
    "isElective": false,
    "createdAt": "2026-03-06T10:00:00.000Z",
    "updatedAt": "2026-03-06T10:00:00.000Z",
    "curriculumMappings": [...],
    "courseOutcomes": [...],
    "_count": {
      "lecturePlans": 12,
      "assessments": 3,
      "attendanceSessions": 15
    }
  }
}
```

**Error Responses:**
- 404: Subject not found

---

### 4. Update Subject
**PUT** `/api/subjects/:id`

**Access:** FACULTY, HOD, ADMIN

**Request Body:** (all fields optional)
```json
{
  "name": "Advanced Data Structures",
  "code": "CS101A",
  "credits": 5,
  "isElective": false
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Subject updated successfully",
  "data": {
    "id": "uuid-here",
    "name": "Advanced Data Structures",
    "code": "CS101A",
    "credits": 5,
    "isElective": false,
    "createdAt": "2026-03-06T10:00:00.000Z",
    "updatedAt": "2026-03-06T11:00:00.000Z"
  }
}
```

**Error Responses:**
- 400: Invalid data
- 404: Subject not found
- 409: Subject code already in use

---

### 5. Delete Subject
**DELETE** `/api/subjects/:id`

**Access:** HOD, ADMIN

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Subject deleted successfully"
}
```

**Error Responses:**
- 404: Subject not found
- 409: Cannot delete subject with existing related data
- 403: Insufficient permissions

---

### 6. Get Subject Statistics
**GET** `/api/subjects/stats`

**Access:** FACULTY, HOD, ADMIN

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "total": 50,
    "elective": 10,
    "core": 40
  }
}
```

---

## Usage Examples

### Using cURL

#### 1. Login as Faculty
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "faculty@ldce.ac.in",
    "password": "yourpassword"
  }'
```

Save the `accessToken` from the response.

#### 2. Create a Subject
```bash
curl -X POST http://localhost:5000/api/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Web Development",
    "code": "CS102",
    "credits": 3,
    "isElective": false
  }'
```

#### 3. Get All Subjects
```bash
curl -X GET http://localhost:5000/api/subjects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4. Search Subjects
```bash
curl -X GET "http://localhost:5000/api/subjects?search=web" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 5. Update a Subject
```bash
curl -X PUT http://localhost:5000/api/subjects/YOUR_SUBJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "credits": 4
  }'
```

#### 6. Delete a Subject
```bash
curl -X DELETE http://localhost:5000/api/subjects/YOUR_SUBJECT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Using JavaScript (Fetch API)

```javascript
// Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Store token after login
let accessToken = '';

// Login
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  accessToken = data.data.accessToken;
  return data;
}

// Create Subject
async function createSubject(subjectData) {
  const response = await fetch(`${API_BASE_URL}/subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(subjectData)
  });
  return await response.json();
}

// Get All Subjects
async function getAllSubjects(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${API_BASE_URL}/subjects${queryParams ? '?' + queryParams : ''}`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return await response.json();
}

// Update Subject
async function updateSubject(subjectId, updates) {
  const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(updates)
  });
  return await response.json();
}

// Example Usage
async function main() {
  // Login
  await login('faculty@ldce.ac.in', 'yourpassword');
  
  // Create a subject
  const newSubject = await createSubject({
    name: 'Database Management',
    code: 'CS103',
    credits: 4,
    isElective: false
  });
  console.log('Created:', newSubject);
  
  // Get all subjects
  const subjects = await getAllSubjects({ search: 'database' });
  console.log('Subjects:', subjects);
}
```

---

## Prisma Studio Integration

The subjects created through this API are automatically synced with the Prisma database. You can view them in Prisma Studio:

1. Start Prisma Studio:
```bash
npm run studio
# or
.\start-prisma-studio.bat
```

2. Navigate to the `subjects` table to view all created courses

---

## Role-Based Access Control

| Endpoint | STUDENT | FACULTY | HOD | ADMIN |
|----------|---------|---------|-----|-------|
| Create Subject | ❌ | ✅ | ✅ | ✅ |
| Get All Subjects | ✅ | ✅ | ✅ | ✅ |
| Get Subject by ID | ✅ | ✅ | ✅ | ✅ |
| Update Subject | ❌ | ✅ | ✅ | ✅ |
| Delete Subject | ❌ | ❌ | ✅ | ✅ |
| Get Stats | ❌ | ✅ | ✅ | ✅ |

---

## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical error details (in development mode)"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate code)
- `500`: Internal Server Error

---

## Testing Checklist

- [ ] Login as FACULTY user
- [ ] Create a new subject
- [ ] Verify subject appears in database (Prisma Studio)
- [ ] Get all subjects
- [ ] Search for specific subject
- [ ] Update subject details
- [ ] Get subject statistics
- [ ] Try to create duplicate code (should fail)
- [ ] Login as STUDENT (should NOT be able to create)
- [ ] Delete subject (HOD/ADMIN only)

---

## Database Schema Reference

```prisma
model Subject {
  id                  String              @id @default(uuid())
  name                String
  code                String              @unique
  credits             Int
  isElective          Boolean             @default(false)
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt
  
  // Relations
  curriculumMappings  CurriculumMapping[]
  courseOutcomes      CourseOutcome[]
  lecturePlans        LecturePlan[]
  assessments         Assessment[]
  attendanceSessions  AttendanceSession[]
}
```

---

## Support

For issues or questions, please contact the development team or refer to the main project documentation.
