# 🔗 Frontend-Backend Integration Guide

## ✅ Setup Complete!

Your C2C system is now fully integrated with the PostgreSQL database.

## 🗄️ Database Connection

**Connection String:** `postgres://...@db.prisma.io:5432/postgres`
**Status:** ✅ Connected and seeded

## 📡 API Endpoints Available

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |
| PUT | `/api/auth/change-password` | Change password (protected) |
| POST | `/api/auth/refresh-token` | Refresh access token |
| POST | `/api/auth/logout` | Logout user (protected) |

## 🔐 Test Credentials

Use these credentials to login from your frontend:

```
Student:
- Email: student.john@college.edu
- Password: Student@123

Faculty:
- Email: faculty.john@college.edu
- Password: Faculty@123

HOD:
- Email: hod.computer@college.edu
- Password: Hod@123

Admin:
- Email: admin@college.edu
- Password: Admin@123
```

## 🚀 How to Use in Frontend

### 1. Login Example

```javascript
// In your LoginPage.jsx or similar
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Save tokens
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### 2. Protected API Calls

```javascript
// Helper function to make authenticated requests
const makeAuthRequest = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('accessToken');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`http://localhost:5000/api${endpoint}`, options);
  return response.json();
};

// Usage
const profile = await makeAuthRequest('/auth/profile');
```

### 3. Get User Profile

```javascript
const getUserProfile = async () => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:5000/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('User:', data.data);
    // data.data contains:
    // - id, email, fullName, role
    // - facultyProfile (if faculty/HOD)
    // - studentProfile (if student)
  }
};
```

## 📱 Frontend Configuration

Your frontend is already configured in `src/config/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    // ... more endpoints
  },
};
```

## 🔄 Token Refresh Flow

```javascript
// When access token expires (401 error)
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    return data.data.accessToken;
  }
  
  // If refresh fails, logout user
  localStorage.clear();
  window.location.href = '/login';
};
```

## 🛠️ Start Development

### 1. Start Backend Server

**Option A:** Double-click `start-server.bat` in backend folder

**Option B:** Command line
```bash
cd E:\c2c\backend
npm run dev
```

Server runs on: **http://localhost:5000**

### 2. Start Frontend

```bash
cd E:\c2c\C2C-108
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 3. Open Prisma Studio (View Database)

**Option A:** Double-click `start-prisma-studio.bat`

**Option B:** Command line
```bash
cd E:\c2c\backend
npm run prisma:studio
```

Opens at: **http://localhost:5555**

## 🧪 Testing the Integration

### Step 1: Start Backend
```bash
cd E:\c2c\backend
npm run dev
```

### Step 2: Test Login API
Open browser console and run:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student.john@college.edu',
    password: 'Student@123'
  })
})
.then(r => r.json())
.then(console.log)
```

### Step 3: Start Frontend
```bash
cd E:\c2c\C2C-108
npm run dev
```

### Step 4: Login from Frontend
- Go to http://localhost:5173
- Navigate to login page
- Use test credentials:
  - Email: `student.john@college.edu`
  - Password: `Student@123`

## 📊 Database Structure

Your PostgreSQL database now contains:

### Users
- 1 Admin user
- 1 HOD user
- 1 Faculty user
- 1 Student user

### Organization
- 2 Departments (Computer Engineering, IT)
- 1 Program (B.E. Computer Engineering)
- 1 Semester (Semester 5)
- 1 Division (A)
- 1 Batch (A1)

### Curriculum
- 2 Subjects (Analysis of Algorithms, DBMS)
- 2 Course Outcomes
- 1 CO-PO Matrix entry

## 🔍 View Database

Open Prisma Studio to see all your data:
```bash
npm run prisma:studio
```

You can:
- ✅ View all users
- ✅ Edit user data
- ✅ Add new records
- ✅ Test relationships
- ✅ See all tables

## 🐛 Troubleshooting

### "Route not found" Error

**Cause:** Backend server not running or wrong API URL

**Fix:**
1. Make sure backend is running on port 5000
2. Check frontend `.env` file has: `VITE_API_URL=http://localhost:5000/api`
3. Verify API endpoints in `src/config/api.js`

### CORS Error

**Cause:** Frontend URL not in CORS whitelist

**Fix:** Backend already configured for `http://localhost:5173`

### 401 Unauthorized

**Cause:** Missing or invalid token

**Fix:**
1. Check token is saved in localStorage
2. Verify Authorization header: `Bearer <token>`
3. Token might be expired - use refresh token

### Can't Connect to Database

**Fix:**
1. Check `.env` in backend has correct DATABASE_URL
2. Run `npm run prisma:push` to sync schema

## 📝 Next Steps

1. ✅ Backend is running on port 5000
2. ✅ Database is connected and seeded
3. ✅ Frontend can now make API calls
4. ✅ Test login from your frontend
5. ✅ View data in Prisma Studio

## 💡 Quick Commands

```bash
# Backend
cd E:\c2c\backend
npm run dev              # Start server
npm run prisma:studio    # View database
npm run prisma:seed      # Reseed data

# Frontend
cd E:\c2c\C2C-108
npm run dev              # Start frontend

# Test API
node E:\c2c\backend\test-api.js
```

## 🎯 API Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

**🎉 Your frontend is now connected to the PostgreSQL database!**

Try logging in from your frontend and watch the data appear in Prisma Studio!
