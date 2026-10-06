// Built-in fetch used.
import assert from 'assert';

const BASE_URL = 'http://localhost:3000/api/integration/karatetech';

async function testHealth() {
  console.log('--- 2. HEALTH TEST ---');
  // Unauthenticated
  let res = await fetch(`${BASE_URL}/health`, { headers: { 'X-Test-Role': 'UNAUTHENTICATED' } });
  assert.strictEqual(res.status, 401, 'Unauthenticated should return 401');

  // Unauthorized
  res = await fetch(`${BASE_URL}/health`, { headers: { 'X-Test-Role': 'MEMBER' } });
  assert.strictEqual(res.status, 403, 'Unauthorized should return 403');

  // Authorized
  res = await fetch(`${BASE_URL}/health`, { headers: { 'X-Test-Role': 'SUPERADMIN' } });
  assert.strictEqual(res.status, 200, 'Authorized should return 200');
  const data = await res.json();
  console.log('Health:', data);
}

async function testSingleParticipant() {
  console.log('\n--- 3. SINGLE PARTICIPANT END-TO-END TEST ---');
  // NOTE: This assumes member 'Scms-MEM-000001' exists in Supabase.
  const payload = { memberId: 'Scms-MEM-000001' };
  
  const res = await fetch(`${BASE_URL}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Test-Role': 'SUPERADMIN' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log('Single Sync Response:', data);
  // This will probably fail gracefully if DB doesn't have the member, but we log it to check.
}

async function testConcurrency() {
  console.log('\n--- 5. CONCURRENT SCMS TEST ---');
  const payload = { memberId: 'Scms-MEM-000001' };
  
  const requests = Array.from({ length: 10 }).map(() => 
    fetch(`${BASE_URL}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Test-Role': 'SUPERADMIN' },
      body: JSON.stringify(payload)
    }).then(r => r.json())
  );
  
  const results = await Promise.all(requests);
  console.log('Concurrency Results:', results.map(r => r.success ? 'OK' : r.message));
}

async function testBatch() {
  console.log('\n--- 6. BATCH TEST ---');
  const payload = { clubId: 'Scms-CLUB-000001', memberIds: ['Scms-MEM-000001', 'Scms-MEM-000002'] };
  
  const res = await fetch(`${BASE_URL}/participants/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Test-Role': 'SUPERADMIN' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log('Batch Sync Response:', data);
}

async function runAll() {
  try {
    await testHealth();
    await testSingleParticipant();
    // await testConcurrency();
    // await testBatch();
    console.log('\nTESTS COMPLETED.');
  } catch (err) {
    console.error('TEST FAILED:', err);
  }
}

runAll();
