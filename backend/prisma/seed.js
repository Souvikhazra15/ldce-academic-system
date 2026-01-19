import { PrismaClient } from '../generated/prisma/index.js';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Departments
  console.log('Creating departments...');
  const computerDept = await prisma.department.upsert({
    where: { code: '07' },
    update: {},
    create: {
      code: '07',
      name: 'Computer Engineering',
    },
  });

  const itDept = await prisma.department.upsert({
    where: { code: '08' },
    update: {},
    create: {
      code: '08',
      name: 'Information Technology',
    },
  });

  // Create Admin User
  console.log('Creating admin user...');
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: {
      email: 'admin@college.edu',
      password: adminPassword,
      fullName: 'System Administrator',
      role: 'ADMIN',
      phone: '+91-9876543210',
      isActive: true,
    },
  });

  // Create HOD User
  console.log('Creating HOD user...');
  const hodPassword = await hashPassword('Hod@123');
  const hod = await prisma.user.upsert({
    where: { email: 'hod.computer@college.edu' },
    update: {},
    create: {
      email: 'hod.computer@college.edu',
      password: hodPassword,
      fullName: 'Dr. Rajesh Kumar',
      role: 'HOD',
      phone: '+91-9876543211',
      isActive: true,
    },
  });

  // Create HOD Faculty Profile
  const hodProfile = await prisma.facultyProfile.upsert({
    where: { userId: hod.id },
    update: {},
    create: {
      userId: hod.id,
      departmentId: computerDept.id,
      designation: 'Professor & HOD',
      qualification: 'Ph.D. in Computer Science',
      joiningDate: new Date('2010-07-01'),
    },
  });

  // Update department with HOD
  await prisma.department.update({
    where: { id: computerDept.id },
    data: { hodUserId: hod.id },
  });

  // Create Faculty User
  console.log('Creating faculty user...');
  const facultyPassword = await hashPassword('Faculty@123');
  const faculty = await prisma.user.upsert({
    where: { email: 'faculty.john@college.edu' },
    update: {},
    create: {
      email: 'faculty.john@college.edu',
      password: facultyPassword,
      fullName: 'Prof. John Doe',
      role: 'FACULTY',
      phone: '+91-9876543212',
      isActive: true,
    },
  });

  // Create Faculty Profile
  await prisma.facultyProfile.upsert({
    where: { userId: faculty.id },
    update: {},
    create: {
      userId: faculty.id,
      departmentId: computerDept.id,
      designation: 'Assistant Professor',
      qualification: 'M.Tech in Computer Engineering',
      joiningDate: new Date('2018-08-15'),
    },
  });

  // Create Program
  console.log('Creating program...');
  const beProgram = await prisma.program.upsert({
    where: { id: 'be-computer-engineering' },
    update: {},
    create: {
      id: 'be-computer-engineering',
      departmentId: computerDept.id,
      name: 'B.E. Computer Engineering',
      totalSemesters: 8,
    },
  });

  // Create Academic Terms (Semesters)
  console.log('Creating academic terms...');
  const sem5 = await prisma.academicTerm.upsert({
    where: {
      programId_termNumber: {
        programId: beProgram.id,
        termNumber: 5,
      },
    },
    update: {},
    create: {
      programId: beProgram.id,
      termNumber: 5,
      subjectIds: [],
    },
  });

  // Create Division
  console.log('Creating division...');
  const divisionA = await prisma.division.upsert({
    where: {
      academicTermId_name: {
        academicTermId: sem5.id,
        name: 'A',
      },
    },
    update: {},
    create: {
      academicTermId: sem5.id,
      name: 'A',
    },
  });

  // Create Student Batches
  console.log('Creating student batches...');
  const batchA1 = await prisma.studentBatch.upsert({
    where: {
      divisionId_name: {
        divisionId: divisionA.id,
        name: 'A1',
      },
    },
    update: {},
    create: {
      divisionId: divisionA.id,
      name: 'A1',
    },
  });

  // Create Student User
  console.log('Creating student user...');
  const studentPassword = await hashPassword('Student@123');
  const student = await prisma.user.upsert({
    where: { email: 'student.john@college.edu' },
    update: {},
    create: {
      email: 'student.john@college.edu',
      password: studentPassword,
      fullName: 'John Smith',
      role: 'STUDENT',
      phone: '+91-9876543213',
      isActive: true,
    },
  });

  // Create Student Profile
  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      enrollmentNo: '210070116001',
      currentDivisionId: divisionA.id,
      currentBatchId: batchA1.id,
      electiveSubjects: [],
    },
  });

  // Create Subjects
  console.log('Creating subjects...');
  const aoa = await prisma.subject.upsert({
    where: { code: '3170701' },
    update: {},
    create: {
      code: '3170701',
      name: 'Analysis of Algorithms',
      credits: 4,
      isElective: false,
    },
  });

  const dbms = await prisma.subject.upsert({
    where: { code: '3170702' },
    update: {},
    create: {
      code: '3170702',
      name: 'Database Management Systems',
      credits: 4,
      isElective: false,
    },
  });

  // Create Curriculum Mapping
  console.log('Creating curriculum mappings...');
  await prisma.curriculumMapping.upsert({
    where: {
      programId_subjectId_semesterNumber: {
        programId: beProgram.id,
        subjectId: aoa.id,
        semesterNumber: 5,
      },
    },
    update: {},
    create: {
      programId: beProgram.id,
      subjectId: aoa.id,
      semesterNumber: 5,
    },
  });

  // Create Course Outcomes
  console.log('Creating course outcomes...');
  const co1 = await prisma.courseOutcome.upsert({
    where: {
      subjectId_coCode: {
        subjectId: aoa.id,
        coCode: 'CO1',
      },
    },
    update: {},
    create: {
      subjectId: aoa.id,
      coCode: 'CO1',
      description: 'Analyze the complexity of algorithms',
      targetThreshold: 40.0,
    },
  });

  const co2 = await prisma.courseOutcome.upsert({
    where: {
      subjectId_coCode: {
        subjectId: aoa.id,
        coCode: 'CO2',
      },
    },
    update: {},
    create: {
      subjectId: aoa.id,
      coCode: 'CO2',
      description: 'Design efficient algorithms',
      targetThreshold: 40.0,
    },
  });

  // Create CO-PO Matrix
  console.log('Creating CO-PO matrices...');
  await prisma.cOPOMatrix.upsert({
    where: {
      coId_poCode: {
        coId: co1.id,
        poCode: 'PO1',
      },
    },
    update: {},
    create: {
      coId: co1.id,
      poCode: 'PO1',
      poStrength: 3, // High correlation
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('─────────────────────────────────────');
  console.log('Admin:');
  console.log('  Email: admin@college.edu');
  console.log('  Password: Admin@123');
  console.log('\nHOD:');
  console.log('  Email: hod.computer@college.edu');
  console.log('  Password: Hod@123');
  console.log('\nFaculty:');
  console.log('  Email: faculty.john@college.edu');
  console.log('  Password: Faculty@123');
  console.log('\nStudent:');
  console.log('  Email: student.john@college.edu');
  console.log('  Password: Student@123');
  console.log('─────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
