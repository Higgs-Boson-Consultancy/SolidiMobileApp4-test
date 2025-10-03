#!/usr/bin/env node

/**
 * Test withdraw API with correct signature method matching the app
 */

const https = require('https');
const crypto = require('crypto');

// Real API credentials from test-all-apis.js
const API_KEY = 'iqZKMVbnCcXgpLteFaSuUMbndUw4BkWSCrXylu8PycdcGNBKXKF56twx';
const API_SECRET = 'AL8N3xtau892JbZLJPnEUhnzVZBOVpVw93GMfJL9CP1s1sHQN9YfDIh3crHzXecamZS8vkS7WO7fuBqQzKFHiQaM';
const BASE_URL = 'https://t2.solidi.co/api2/v1';
const SIGNING_DOMAIN = 'www.solidi.co'; // This is what the app uses for t2.solidi.co

// Create HMAC signature exactly like the app does
function createSignature(path, postData) {
  // Match the app's signature method:
  // dataToSign = signingDomain + path + postData
  const dataToSign = SIGNING_DOMAIN + path + postData;
  
  // Convert secret to base64 first (like the app)
  const secretBase64 = Buffer.from(API_SECRET).toString('base64');
  
  // Create HMAC-SHA256 and return as base64 (not SHA512 like I tried before)
  const hmac = crypto.createHmac('sha256', secretBase64);
  hmac.update(dataToSign);
  return hmac.digest('base64');
}

async function testWithdrawAPI() {
  console.log('🧪 Testing Withdraw API with Correct Signature Method...');
  console.log(`🔑 API Key: ${API_KEY.substring(0, 8)}...`);
  console.log(`🏠 Base URL: ${BASE_URL}`);
  console.log(`📝 Signing Domain: ${SIGNING_DOMAIN}`);
  console.log('');

  // Test data - must include nonce like the app does
  const nonce = Date.now() * 1000; // Microsecond timestamp like the app
  const withdrawData = {
    volume: '0.00001',
    address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell',
    priority: 'normal',
    nonce: nonce  // Include nonce in the data
  };

  const postData = JSON.stringify(withdrawData);
  const path = '/api2/v1/withdraw/BTC';
  
  console.log('📤 Request Data:');
  console.log(`- Path: ${path}`);
  console.log(`- Nonce: ${nonce}`);
  console.log(`- Post Data: ${postData}`);
  
  // Create signature using the app's method
  const signature = createSignature(path, postData);
  console.log(`- Data to sign: ${SIGNING_DOMAIN}${path}${postData.substring(0, 50)}...`);
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
            
            // Check for specific error types
            if (jsonResponse.error.includes('nonce')) {
              console.log('🔍 This is a nonce-related error - authentication is working but nonce issue');
            } else if (jsonResponse.error.includes('verify')) {
              console.log('🔍 This is a signature verification error - our signature method might still be wrong');
            } else if (jsonResponse.error.includes('address') || jsonResponse.error.includes('param')) {
              console.log('✅ Authentication worked! This is a parameter/validation error');
            }
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