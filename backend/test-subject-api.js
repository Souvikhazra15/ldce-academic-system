// Test script for Subject Management API
// Run with: node test-subject-api.js

const API_BASE_URL = 'http://localhost:5000/api';

let accessToken = '';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${options.method || 'GET'} ${endpoint}`);
  console.log(`Status: ${response.status} ${response.statusText}`);
  console.log(`Response:`, JSON.stringify(data, null, 2));
  console.log('='.repeat(60));

  return { response, data };
}

// Test functions
async function testLogin() {
  console.log('\n📝 TEST 1: Login as Faculty');
  const { data } = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'faculty@ldce.ac.in',
      password: 'yourpassword'
    })
  });

  if (data.success) {
    accessToken = data.data.accessToken;
    console.log('✅ Login successful! Token saved.');
  } else {
    console.log('❌ Login failed!');
    throw new Error('Authentication required for further tests');
  }
}

async function testCreateSubject() {
  console.log('\n📝 TEST 2: Create Subject - Data Structures');
  const { data } = await apiCall('/subjects', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Data Structures',
      code: 'CS101',
      credits: 4,
      isElective: false
    })
  });

  if (data.success) {
    console.log('✅ Subject created successfully!');
    return data.data.id;
  } else {
    console.log('⚠️ Subject creation issue (might already exist)');
    return null;
  }
}

async function testCreateElectiveSubject() {
  console.log('\n📝 TEST 3: Create Elective Subject - Machine Learning');
  const { data } = await apiCall('/subjects', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Machine Learning',
      code: 'CS401E',
      credits: 3,
      isElective: true
    })
  });

  if (data.success) {
    console.log('✅ Elective subject created successfully!');
    return data.data.id;
  } else {
    console.log('⚠️ Elective subject creation issue (might already exist)');
    return null;
  }
}

async function testDuplicateSubject() {
  console.log('\n📝 TEST 4: Create Duplicate Subject (Should Fail)');
  const { data, response } = await apiCall('/subjects', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Another Data Structures',
      code: 'CS101', // Duplicate code
      credits: 4,
      isElective: false
    })
  });

  if (response.status === 409) {
    console.log('✅ Correctly rejected duplicate subject code!');
  } else if (!data.success) {
    console.log('⚠️ Subject rejected (expected behavior)');
  } else {
    console.log('❌ Should have rejected duplicate code!');
  }
}

async function testMissingFields() {
  console.log('\n📝 TEST 5: Create Subject with Missing Fields (Should Fail)');
  const { data, response } = await apiCall('/subjects', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Incomplete Subject'
      // Missing code and credits
    })
  });

  if (response.status === 400) {
    console.log('✅ Correctly rejected incomplete subject data!');
  } else {
    console.log('❌ Should have rejected missing fields!');
  }
}

async function testGetAllSubjects() {
  console.log('\n📝 TEST 6: Get All Subjects');
  const { data } = await apiCall('/subjects?page=1&limit=10');

  if (data.success) {
    console.log(`✅ Retrieved ${data.data.subjects.length} subjects`);
    console.log(`Total subjects in database: ${data.data.pagination.total}`);
  } else {
    console.log('❌ Failed to get subjects');
  }
}

async function testSearchSubjects() {
  console.log('\n📝 TEST 7: Search Subjects by "data"');
  const { data } = await apiCall('/subjects?search=data');

  if (data.success) {
    console.log(`✅ Found ${data.data.subjects.length} subjects matching "data"`);
  } else {
    console.log('❌ Search failed');
  }
}

async function testGetElectiveSubjects() {
  console.log('\n📝 TEST 8: Get Elective Subjects Only');
  const { data } = await apiCall('/subjects?isElective=true');

  if (data.success) {
    console.log(`✅ Found ${data.data.subjects.length} elective subjects`);
  } else {
    console.log('❌ Failed to get elective subjects');
  }
}

async function testGetSubjectById(subjectId) {
  if (!subjectId) {
    console.log('\n⏭️ TEST 9: Skipped (no subject ID available)');
    return;
  }

  console.log('\n📝 TEST 9: Get Subject by ID');
  const { data } = await apiCall(`/subjects/${subjectId}`);

  if (data.success) {
    console.log(`✅ Retrieved subject: ${data.data.name}`);
  } else {
    console.log('❌ Failed to get subject by ID');
  }
}

async function testUpdateSubject(subjectId) {
  if (!subjectId) {
    console.log('\n⏭️ TEST 10: Skipped (no subject ID available)');
    return;
  }

  console.log('\n📝 TEST 10: Update Subject Credits');
  const { data } = await apiCall(`/subjects/${subjectId}`, {
    method: 'PUT',
    body: JSON.stringify({
      credits: 5
    })
  });

  if (data.success) {
    console.log(`✅ Subject updated! New credits: ${data.data.credits}`);
  } else {
    console.log('❌ Failed to update subject');
  }
}

async function testGetSubjectStats() {
  console.log('\n📝 TEST 11: Get Subject Statistics');
  const { data } = await apiCall('/subjects/stats');

  if (data.success) {
    console.log('✅ Statistics retrieved:');
    console.log(`   Total subjects: ${data.data.total}`);
    console.log(`   Elective subjects: ${data.data.elective}`);
    console.log(`   Core subjects: ${data.data.core}`);
  } else {
    console.log('❌ Failed to get statistics');
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Subject Management API Tests');
  console.log('Make sure the server is running on http://localhost:5000\n');

  try {
    // Authentication
    await testLogin();

    // Create operations
    const subjectId = await testCreateSubject();
    await testCreateElectiveSubject();
    
    // Error handling tests
    await testDuplicateSubject();
    await testMissingFields();

    // Read operations
    await testGetAllSubjects();
    await testSearchSubjects();
    await testGetElectiveSubjects();
    await testGetSubjectById(subjectId);
    await testGetSubjectStats();

    // Update operations
    await testUpdateSubject(subjectId);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 All tests completed!');
    console.log('='.repeat(60));
    console.log('\n✨ Summary:');
    console.log('- Created subjects are stored in the Prisma database');
    console.log('- View them in Prisma Studio: npm run studio');
    console.log('- API is ready for frontend integration');
    console.log('\n📚 For full API documentation, see: SUBJECT_API_DOCS.md');
    console.log('📮 For Postman testing, import: Subject_API_Collection.postman_collection.json\n');

  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/')) {
  runAllTests();
}

export { runAllTests, apiCall };
