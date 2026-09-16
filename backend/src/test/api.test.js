import request from 'supertest';
import app from '../app.js';
import { connectDB, closeDB } from '../config/db.js';
import { seedDatabase } from '../seeds/seedCore.js';

const runTests = async () => {
  console.log('--- STARTING BACKEND INTEGRATION TEST SUITE ---');
  await connectDB();
  await seedDatabase();

  let adminToken = '';
  let citizenToken = '';
  let testComplaintId = '';

  // 1. Health check
  console.log('Test 1: Health check endpoint');
  const healthRes = await request(app).get('/api/health');
  if (healthRes.status !== 200 || healthRes.body.status !== 'OK') {
    throw new Error(`Health check failed: ${JSON.stringify(healthRes.body)}`);
  }
  console.log('✅ Health check passed');

  // 2. Admin Login
  console.log('Test 2: Admin Login');
  const adminLoginRes = await request(app)
    .post('/api/auth/login')
    .send({ identifier: 'jshivraj028@gmail.com', password: 'Pass@123' });
  if (adminLoginRes.status !== 200 || !adminLoginRes.body.data.token) {
    throw new Error(`Admin login failed: ${JSON.stringify(adminLoginRes.body)}`);
  }
  adminToken = adminLoginRes.body.data.token;
  console.log(`✅ Admin login passed (Token received for: ${adminLoginRes.body.data.name})`);

  // 3. Citizen Login
  console.log('Test 3: Citizen Login');
  const citizenLoginRes = await request(app)
    .post('/api/auth/login')
    .send({ identifier: 'citizen@yewlagp.in', password: 'CitizenPassword123!' });
  if (citizenLoginRes.status !== 200 || !citizenLoginRes.body.data.token) {
    throw new Error(`Citizen login failed: ${JSON.stringify(citizenLoginRes.body)}`);
  }
  citizenToken = citizenLoginRes.body.data.token;
  console.log(`✅ Citizen login passed (Token received for: ${citizenLoginRes.body.data.name})`);

  // 4. Citizen submits complaint
  console.log('Test 4: Citizen submits complaint');
  const complaintRes = await request(app)
    .post('/api/complaints')
    .set('Authorization', `Bearer ${citizenToken}`)
    .send({
      category: 'Garbage',
      title: 'Uncollected garbage near bus stand',
      description: 'Garbage bin has been overflowing for 2 days.',
      location: 'Near Old Bus Stand, Ward 3',
      wardNumber: 3,
      priority: 'High',
    });
  if (complaintRes.status !== 201 || !complaintRes.body.data.complaintId) {
    throw new Error(`Complaint creation failed: ${JSON.stringify(complaintRes.body)}`);
  }
  testComplaintId = complaintRes.body.data._id;
  const trackingNumber = complaintRes.body.data.complaintId;
  console.log(`✅ Complaint submitted successfully with ID: ${trackingNumber}`);

  // 5. Admin updates complaint status with remarks
  console.log('Test 5: Admin updates complaint status & remarks');
  const updateRes = await request(app)
    .patch(`/api/complaints/${testComplaintId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      status: 'In Progress',
      adminRemarks: 'Sanitation team notified to clear the garbage immediately.',
    });
  if (updateRes.status !== 200 || updateRes.body.data.status !== 'In Progress') {
    throw new Error(`Complaint status update failed: ${JSON.stringify(updateRes.body)}`);
  }
  console.log('✅ Admin complaint status update & remark audit log passed');

  // 6. Citizen views complaint history timeline
  console.log('Test 6: Citizen views complaint details with timeline');
  const detailRes = await request(app)
    .get(`/api/complaints/${testComplaintId}`)
    .set('Authorization', `Bearer ${citizenToken}`);
  if (detailRes.status !== 200 || detailRes.body.data.history.length < 2) {
    throw new Error(`Complaint timeline history failed: ${JSON.stringify(detailRes.body)}`);
  }
  console.log(`✅ Complaint timeline contains ${detailRes.body.data.history.length} audit steps`);

  // 7. Security: Citizen cannot access Admin-only Users list
  console.log('Test 7: Security check - Citizen forbidden from /api/users');
  const forbiddenRes = await request(app)
    .get('/api/users')
    .set('Authorization', `Bearer ${citizenToken}`);
  if (forbiddenRes.status !== 403) {
    throw new Error(`Security failed! Citizen got status: ${forbiddenRes.status}`);
  }
  console.log('✅ Security check passed (403 Forbidden properly returned for unauthorized role)');

  // 8. Admin fetches dashboard stats
  console.log('Test 8: Admin fetches dashboard analytics');
  const statsRes = await request(app)
    .get('/api/reports/dashboard-stats')
    .set('Authorization', `Bearer ${adminToken}`);
  if (statsRes.status !== 200 || !statsRes.body.data.cards) {
    throw new Error(`Dashboard stats failed: ${JSON.stringify(statsRes.body)}`);
  }
  console.log(
    `✅ Dashboard stats returned: ${statsRes.body.data.cards.totalComplaints} total complaints, ${statsRes.body.data.cards.totalCitizens} citizens`
  );

  console.log('--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
  await closeDB();
  process.exit(0);
};

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
