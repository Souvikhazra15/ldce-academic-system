// Test API Endpoints
// Run this file with: node test-api.js

const API_URL = 'http://localhost:5000';

// Test data
const testUsers = {
  admin: {
    email: 'admin@college.edu',
    password: 'Admin@123',
  },
  hod: {
    email: 'hod.computer@college.edu',
    password: 'Hod@123',
  },
  faculty: {
    email: 'faculty.john@college.edu',
    password: 'Faculty@123',
  },
  student: {
    email: 'student.john@college.edu',
    password: 'Student@123',
  },
};

// Helper function to make requests
async function makeRequest(endpoint, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  const result = await makeRequest('/health');
  console.log('Status:', result.status);
  console.log('Response:', result.data);
  return result.status === 200;
}

async function testLogin(userType = 'student') {
  console.log(`\n🔐 Testing Login (${userType})...`);
  const user = testUsers[userType];
  const result = await makeRequest('/api/auth/login', 'POST', user);
  console.log('Status:', result.status);
  
  if (result.status === 200) {
    console.log('✅ Login successful');
    console.log('User:', result.data.data.user.fullName);
    console.log('Role:', result.data.data.user.role);
    console.log('Access Token:', result.data.data.accessToken.substring(0, 50) + '...');
    return result.data.data.accessToken;
  } else {
    console.log('❌ Login failed:', result.data.message);
    return null;
  }
}

async function testGetProfile(token) {
  console.log('\n👤 Testing Get Profile...');
  const result = await makeRequest('/api/auth/profile', 'GET', null, token);
  console.log('Status:', result.status);
  
  if (result.status === 200) {
    console.log('✅ Profile retrieved');
    console.log('User:', result.data.data.fullName);
    console.log('Email:', result.data.data.email);
    console.log('Role:', result.data.data.role);
    
    if (result.data.data.facultyProfile) {
      console.log('Faculty Profile:', {
        designation: result.data.data.facultyProfile.designation,
        department: result.data.data.facultyProfile.department.name,
      });
    }
    
    if (result.data.data.studentProfile) {
      console.log('Student Profile:', {
        enrollmentNo: result.data.data.studentProfile.enrollmentNo,
      });
    }
  } else {
    console.log('❌ Failed to get profile:', result.data.message);
  }
}

async function testRegister() {
  console.log('\n📝 Testing Registration...');
  const newUser = {
    email: `test${Date.now()}@college.edu`,
    password: 'Test@123',
    fullName: 'Test User',
    role: 'STUDENT',
    phone: '+91-9876543299',
  };
  
  const result = await makeRequest('/api/auth/register', 'POST', newUser);
  console.log('Status:', result.status);
  
  if (result.status === 201) {
    console.log('✅ Registration successful');
    console.log('User:', result.data.data.user.fullName);
    console.log('Email:', result.data.data.user.email);
  } else {
    console.log('❌ Registration failed:', result.data.message);
  }
}

async function testUnauthorizedAccess() {
  console.log('\n🚫 Testing Unauthorized Access...');
  const result = await makeRequest('/api/auth/profile', 'GET');
  console.log('Status:', result.status);
  
  if (result.status === 401) {
    console.log('✅ Correctly blocked unauthorized access');
  } else {
    console.log('❌ Security issue: Should have been blocked');
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting API Tests...');
  console.log('=' .repeat(60));

  try {
    // Test 1: Health Check
    await testHealthCheck();

    // Test 2: Login for each role
    console.log('\n📋 Testing All User Roles:');
    const studentToken = await testLogin('student');
    await testLogin('faculty');
    await testLogin('hod');
    await testLogin('admin');

    // Test 3: Get Profile
    if (studentToken) {
      await testGetProfile(studentToken);
    }

    // Test 4: Register new user
    await testRegister();

    // Test 5: Unauthorized access
    await testUnauthorizedAccess();

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
}

// Run tests
runAllTests();
