# C2C Backend - Quick Reference

## 🚀 Start Commands

### Start the Server
```bash
npm run dev
```
Or double-click: `start-server.bat`

### Open Prisma Studio (View Database)
```bash
npm run prisma:studio
```
Or double-click: `start-prisma-studio.bat`

## 🔐 Test Login Credentials

**Admin:**
- Email: `admin@college.edu`
- Password: `Admin@123`

**HOD:**
- Email: `hod.computer@college.edu`
- Password: `Hod@123`

**Faculty:**
- Email: `faculty.john@college.edu`
- Password: `Faculty@123`

**Student:**
- Email: `student.john@college.edu`
- Password: `Student@123`

## 📡 API Endpoints

**Base URL:** `http://localhost:5000`

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Example Login Request
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student.john@college.edu",
  "password": "Student@123"
}
```

### Example Protected Request
```json
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

## 📊 Database Models

### Users & Authentication
- **User** - All system users (Student, Faculty, HOD, Admin)
- **FacultyProfile** - Faculty-specific information
- **StudentProfile** - Student-specific information

### Organization
- **Department** - Academic departments (Computer, IT, etc.)
- **Program** - Degree programs (B.E., M.E.)
- **AcademicTerm** - Semesters (1-8)
- **Division** - Class divisions (A, B, C)
- **StudentBatch** - Lab batches (A1, A2)

### Curriculum
- **Subject** - Courses/subjects
- **CurriculumMapping** - Subject-semester mappings
- **CourseOutcome** - Course outcomes (CO1, CO2, etc.)
- **COPOMatrix** - CO-PO correlation matrix

### Assessment
- **Assessment** - Exams and tests (MSE, ESE, Quiz)
- **AssessmentConfig** - Question-CO mappings
- **StudentMark** - Student scores

### Attendance
- **AttendanceSession** - Class sessions
- **AttendanceRecord** - Student attendance records

### AI Features
- **LecturePlan** - AI-generated lecture planning

## 🛠️ Common Tasks

### Reset Database
```bash
npm run prisma:reset
```

### Seed Database
```bash
npm run prisma:seed
```

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Push Schema Changes
```bash
npm run prisma:push
```

### Complete Setup (All at once)
```bash
npm run db:setup
```

## 🔒 User Roles

| Role | Description |
|------|-------------|
| STUDENT | Students accessing their courses and marks |
| FACULTY | Teachers managing courses and assessments |
| HOD | Head of Department with administrative access |
| ADMIN | System administrators with full access |

## 💡 Tips

1. **View Database:** Use Prisma Studio (`npm run prisma:studio`) to view and edit data
2. **Test API:** Run `node test-api.js` to test all endpoints
3. **Check Logs:** Server logs appear in the terminal where you run `npm run dev`
4. **Hot Reload:** The dev server automatically restarts when you change code

## 📝 Environment Variables

Located in `.env` file:

```env
DATABASE_URL=postgres://...
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:5173
```

## 🐛 Troubleshooting

**Can't connect to database?**
- Check your `DATABASE_URL` in `.env`
- Make sure PostgreSQL is running

**Port 5000 already in use?**
- Change `PORT` in `.env` file
- Or stop the other process using port 5000

**Prisma errors?**
- Run `npm run prisma:generate` to regenerate client
- Run `npm run db:setup` to reset everything

**Authentication not working?**
- Check if JWT_SECRET is set in `.env`
- Make sure you're sending `Authorization: Bearer <token>` header
