# C2C Academic Management System - Backend

Complete backend system built with Node.js, Express, Prisma ORM, and PostgreSQL with JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use Prisma Cloud)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
   - Edit `.env` file with your database URL and JWT secrets

3. **Setup database:**
```bash
npm run db:setup
```
This will:
- Generate Prisma Client
- Push schema to database
- Seed initial data

### Development

**Run development server:**
```bash
npm run dev
```
Server runs on http://localhost:5000

**Open Prisma Studio:**
```bash
npm run prisma:studio
```
View your database at http://localhost:5555

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@college.edu",
  "password": "Password@123",
  "fullName": "John Doe",
  "role": "STUDENT",
  "phone": "+91-9876543210"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@college.edu",
  "password": "Password@123"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

#### Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "John Updated",
  "phone": "+91-9876543210"
}
```

#### Change Password (Protected)
```http
PUT /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

## 🔐 Test Credentials

After seeding, use these credentials:

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

## 🗄️ Database Schema

The system includes:

### Organization & Hierarchy
- **Departments** - Academic departments
- **Programs** - Degree programs (B.E., M.E., etc.)
- **Academic Terms** - Semesters
- **Divisions** - Class divisions (A, B, C)
- **Student Batches** - Lab batches (A1, A2)

### Users & Roles
- **Users** - All system users with JWT authentication
- **Faculty Profiles** - Faculty-specific data
- **Student Profiles** - Student-specific data

### Curriculum & CO-PO
- **Subjects** - Course catalog
- **Curriculum Mappings** - Subject-semester mappings
- **Course Outcomes** - CO definitions
- **CO-PO Matrix** - Correlation matrix

### Assessment
- **Assessments** - Exams and tests
- **Assessment Configs** - Question-CO mappings
- **Student Marks** - Student scores

### Attendance
- **Attendance Sessions** - Class sessions
- **Attendance Records** - Student attendance

### AI Features
- **Lecture Plans** - AI-generated lecture planning

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:migrate` - Create migration
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database
- `npm run prisma:reset` - Reset database
- `npm run db:setup` - Complete database setup

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Access & refresh tokens
- **Role-based Authorization** - STUDENT, FACULTY, HOD, ADMIN
- **Token Refresh** - Secure token renewal
- **Password Validation** - Strong password requirements
- **Account Status** - Active/inactive user management

## 🛠️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Prisma client setup
│   ├── controllers/
│   │   └── authController.js # Auth logic
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── routes/
│   │   └── authRoutes.js     # Auth routes
│   ├── utils/
│   │   ├── jwt.js            # JWT utilities
│   │   └── password.js       # Password utilities
│   └── server.js             # Express app
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.js               # Seed data
├── generated/
│   └── prisma/               # Generated Prisma Client
├── .env                      # Environment variables
└── package.json
```

## 🌐 Environment Variables

```env
DATABASE_URL=postgres://...
NODE_ENV=development
PORT=5000
HOST=localhost
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

## 📊 Database Models

All models follow the ERD specification:
- UUID primary keys
- Proper foreign key relationships
- Timestamps (createdAt, updatedAt)
- Cascading deletes where appropriate
- Unique constraints
- Indexes for performance

## 🧪 Testing

Use Prisma Studio to view and test data:
```bash
npm run prisma:studio
```

## 📝 License

ISC
