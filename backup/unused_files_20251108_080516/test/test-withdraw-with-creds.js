#!/usr/bin/env node

/**
 * Test withdraw API with real credentials from test-all-apis.js
 */

const https = require('https');
const crypto = require('crypto');

// Real API credentials from test-all-apis.js
const API_KEY = 'iqZKMVbnCcXgpLteFaSuUMbndUw4BkWSCrXylu8PycdcGNBKXKF56twx';
const API_SECRET = 'AL8N3xtau892JbZLJPnEUhnzVZBOVpVw93GMfJL9CP1s1sHQN9YfDIh3crHzXecamZS8vkS7WO7fuBqQzKFHiQaM';
const BASE_URL = 'https://t2.solidi.co/api2/v1';

// Create HMAC signature (matching the app's method)
function createSignature(path, postData, nonce) {
  const message = path + crypto.createHash('sha256').update(nonce + postData).digest();
  return crypto.createHmac('sha512', Buffer.from(API_SECRET, 'base64')).update(message).digest('base64');
}

async function testWithdrawAPI() {
  console.log('🧪 Testing Withdraw API with Real Credentials...');
  console.log(`🔑 API Key: ${API_KEY.substring(0, 8)}...`);
  console.log(`🏠 Base URL: ${BASE_URL}`);
  console.log('');

  // Test data
  const withdrawData = {
    volume: '0.00001',
    address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell',
    priority: 'normal'
  };

  const nonce = (Date.now() * 1000).toString(); // Microsecond timestamp as string
  const postData = JSON.stringify(withdrawData);
  const path = '/api2/v1/withdraw/BTC';
  
  console.log('📤 Request Data:');
  console.log(`- Path: ${path}`);
  console.log(`- Nonce: ${nonce}`);
  console.log(`- Post Data: ${postData}`);
  
  // Create signature
  const signature = createSignature(path, postData, nonce);
  console.log(`- Signature: ${signature.substring(0, 16)}...`);
  console.log('');

  // Prepare request
  const options = {
    hostname: 't2.solidi.co',
    port: 443,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'API-Key': API_KEY,
      'API-Sign': signature,
      'Nonce': nonce,
      'User-Agent': 'SolidiTestScript/1.0'
    }
  };

  return new Promise((resolve, reject) => {
    console.log('🚀 Sending request to withdraw API...');
    
    const req = https.request(options, (res) => {
      console.log(`📡 Status: ${res.statusCode} ${res.statusMessage}`);
      console.log('📋 Response Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('');
        console.log('📨 Raw Response:');
        console.log(data);
        
        try {
          const jsonResponse = JSON.parse(data);
          console.log('');
          console.log('📊 Parsed Response:');
          console.log(JSON.stringify(jsonResponse, null, 2));
          
          if (jsonResponse.error) {
            console.log('');
            console.log('❌ API Error:', jsonResponse.error);
          } else if (jsonResponse.id) {
            console.log('');
            console.log('✅ Success! Transaction ID:', jsonResponse.id);
          } else {
            console.log('');
            console.log('⚠️ Unexpected response format');
          }
          
          resolve(jsonResponse);
        } catch (e) {
          console.log('');
          console.log('💥 Failed to parse JSON response:', e.message);
          resolve(data);
        }
      });
    });

    req.on('error', (e) => {
      console.log('💥 Request Error:', e.message);
      reject(e);
    });

    // Send the request
    req.write(postData);
    req.end();
  });
}

// Run the test
testWithdrawAPI()
  .then(() => {
    console.log('');
    console.log('🏁 Test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('💥 Test failed:', error.message);
    process.exit(1);
  });