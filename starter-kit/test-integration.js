/**
 * Integration Test Script
 *
 * This script tests the complete integration between:
 * - API Server
 * - PostgreSQL Database
 * - Windmill Automation Platform
 *
 * Run this after all services are started:
 * node test-integration.js
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001';
const WINDMILL_BASE = 'http://localhost:8000';

// Test data
const testLead = {
  agent_name: "Test Agent",
  agent_email: "test@realestate.com",
  agent_phone: "206-555-0199",
  property_address: "789 Test Street",
  property_city: "Seattle",
  property_state: "WA",
  property_zip: "98101",
  builder_name: "Test Builder LLC",
  builder_company: "Test Builder LLC",
  builder_email: "builder@test.com",
  builder_phone: "206-555-0188",
  project_type: "SINGLE_FAMILY",
  estimated_value: 1500000,
  estimated_units: 1,
  timeline: "Q2 2024",
  notes: "Test lead from integration script",
  referral_source: "Test Agency",
  urgency: "MEDIUM"
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAPIHealth() {
  console.log('\n1️⃣  Testing API Health...');
  try {
    const response = await axios.get(`${API_BASE}/health`);
    if (response.data.status === 'healthy') {
      console.log('   ✅ API is healthy');
      console.log('   ✅ Database is connected');
      return true;
    }
  } catch (error) {
    console.log('   ❌ API is not responding');
    console.log('   Make sure to run: cd api && npm run dev');
    return false;
  }
}

async function testWindmillConnection() {
  console.log('\n2️⃣  Testing Windmill Connection...');
  try {
    const response = await axios.get(`${WINDMILL_BASE}/api/version`);
    console.log('   ✅ Windmill is running');
    return true;
  } catch (error) {
    console.log('   ❌ Windmill is not accessible');
    console.log('   Check docker-compose logs windmill-server');
    return false;
  }
}

async function createTestProject() {
  console.log('\n3️⃣  Creating Test Project...');
  try {
    const response = await axios.post(`${API_BASE}/api/v1/projects`, {
      name: "Test Development Project",
      address: "123 Test Ave",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      project_type: "SINGLE_FAMILY"
    });

    console.log('   ✅ Project created');
    console.log(`   ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.log('   ❌ Failed to create project');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

async function listWorkflows() {
  console.log('\n4️⃣  Listing Available Workflows...');
  try {
    const response = await axios.get(`${API_BASE}/api/v1/workflows/available`);
    console.log(`   ✅ Found ${response.data.length} workflows`);
    response.data.forEach(flow => {
      console.log(`      - ${flow.path}: ${flow.summary}`);
    });
    return true;
  } catch (error) {
    console.log('   ⚠️  Could not list workflows');
    console.log('   This is normal if no workflows are created yet in Windmill');
    return false;
  }
}

async function testWorkflowExecution() {
  console.log('\n5️⃣  Testing Workflow Execution...');
  console.log('   Note: This will fail if lead_intake workflow is not imported to Windmill');

  try {
    const response = await axios.post(`${API_BASE}/api/v1/workflows/run`, {
      workflow_name: "lead_intake",
      entity_type: "project",
      inputs: testLead
    });

    console.log('   ✅ Workflow triggered');
    console.log(`   Execution ID: ${response.data.execution_id}`);
    console.log(`   Windmill Job: ${response.data.windmill_job_id}`);

    // Wait for execution
    console.log('   ⏳ Waiting for workflow to complete...');
    await delay(3000);

    // Check status
    const statusResponse = await axios.get(
      `${API_BASE}/api/v1/workflows/executions/${response.data.execution_id}`
    );

    if (statusResponse.data.status === 'COMPLETED') {
      console.log('   ✅ Workflow completed successfully');
    } else if (statusResponse.data.status === 'RUNNING') {
      console.log('   ⏳ Workflow still running');
    } else {
      console.log(`   ⚠️  Workflow status: ${statusResponse.data.status}`);
    }

    return true;
  } catch (error) {
    console.log('   ⚠️  Workflow execution failed');
    console.log('   This is expected if the workflow hasn\'t been imported to Windmill yet');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('================================================');
  console.log('   Connect 2.0 Integration Test Suite');
  console.log('================================================');

  let allPassed = true;

  // Test API
  const apiHealthy = await testAPIHealth();
  if (!apiHealthy) {
    console.log('\n❌ API is not running. Please start it first:');
    console.log('   cd api && npm run dev\n');
    process.exit(1);
  }

  // Test Windmill
  const windmillRunning = await testWindmillConnection();
  if (!windmillRunning) {
    console.log('\n❌ Windmill is not accessible. Check Docker:');
    console.log('   docker-compose ps');
    console.log('   docker-compose logs windmill-server\n');
    allPassed = false;
  }

  // Create test data
  const project = await createTestProject();
  if (!project) {
    allPassed = false;
  }

  // List workflows
  await listWorkflows();

  // Try workflow execution
  await testWorkflowExecution();

  console.log('\n================================================');
  if (allPassed) {
    console.log('   ✅ All core services are working!');
  } else {
    console.log('   ⚠️  Some services need attention');
  }
  console.log('================================================');

  console.log('\n📚 Next Steps:');
  console.log('1. Open Windmill UI: http://localhost:8000');
  console.log('2. Import the sample workflows from windmill-workflows/');
  console.log('3. Test the workflows through the API');
  console.log('4. Build your own automation workflows!');
  console.log('');
}

// Check if axios is installed
try {
  require.resolve('axios');
  runAllTests();
} catch (error) {
  console.log('Installing axios...');
  require('child_process').execSync('npm install axios', { stdio: 'inherit' });
  console.log('Please run this script again: node test-integration.js');
}