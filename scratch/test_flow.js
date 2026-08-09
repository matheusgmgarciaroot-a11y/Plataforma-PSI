const axios = require('axios');

const API_URL = 'http://localhost:3333';

async function test() {
  try {
    const testEmail = `psy_${Date.now()}@test.com`;
    console.log('1. Registering new psychologist...', testEmail);
    const regRes = await axios.post(`${API_URL}/auth/contract`, {
      name: 'Test Psychologist',
      email: testEmail,
      password: 'password123',
      gender: 'Masculino',
      birthDate: '1990-01-01',
      crp: '123456',
      phone: '11999998888',
      consultationPrice: '150.00'
    });
    console.log('Register Response:', regRes.data);

    console.log('\n2. Logging in as Admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'master@mindora.com',
      password: 'master123'
    });
    const token = loginRes.data.accessToken;
    console.log('Login Success! Token obtained.');

    console.log('\n3. Fetching professionals list...');
    const listRes = await axios.get(`${API_URL}/professionals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const createdPsy = listRes.data.find(p => p.email === testEmail);
    if (!createdPsy) {
      throw new Error('Psychologist not found in the list!');
    }
    console.log('Found psychologist in list. ID:', createdPsy.id, 'Status:', createdPsy.status);

    console.log('\n3.5 Testing credentials update...');
    const updateCredsRes = await axios.patch(`${API_URL}/professionals/${createdPsy.id}/credentials`, {
      name: 'Updated Name',
      email: testEmail,
      crp: '654321',
      phone: '11988887777',
      consultationPrice: 180.00
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update Credentials Response:', updateCredsRes.data);

    console.log('\n4. Approving psychologist access...');
    const approveRes = await axios.patch(`${API_URL}/professionals/${createdPsy.id}/status`, 
      { status: 'active' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Approve Response:', approveRes.data);

    console.log('\n5. Verifying status update...');
    const verifyRes = await axios.get(`${API_URL}/professionals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedPsy = verifyRes.data.find(p => p.email === testEmail);
    console.log('Updated status:', updatedPsy.status);

    console.log('\n6. Suspending psychologist...');
    const suspendRes = await axios.patch(`${API_URL}/professionals/${createdPsy.id}/status`, 
      { status: 'suspended' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Suspend Response:', suspendRes.data);

    console.log('\n7. Verifying status update (suspended)...');
    const verifyRes2 = await axios.get(`${API_URL}/professionals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedPsy2 = verifyRes2.data.find(p => p.email === testEmail);
    console.log('Final status:', updatedPsy2.status);

    console.log('\n8. Deleting test psychologist...');
    const deleteRes = await axios.delete(`${API_URL}/professionals/${createdPsy.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Delete Response:', deleteRes.data);

    console.log('\nAll API actions tested successfully!');
  } catch (err) {
    console.error('Test failed:', err.response ? err.response.data : err.message);
  }
}

test();
