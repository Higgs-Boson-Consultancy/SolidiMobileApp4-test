#!/usr/bin/env node

/**
 * Test withdraw API with WORKING signature method from test-all-apis.js
 */

const https = require('https');
const crypto = require('crypto');

// Real API credentials from test-all-apis.js
const API_KEY = 'iqZKMVbnCcXgpLteFaSuUMbndUw4BkWSCrXylu8PycdcGNBKXKF56twx';
const API_SECRET = 'AL8N3xtau892JbZLJPnEUhnzVZBOVpVw93GMfJL9CP1s1sHQN9YfDIh3crHzXecamZS8vkS7WO7fuBqQzKFHiQaM';
const BASE_URL = 'https://t2.solidi.co/api2/v1';
const SIGNING_DOMAIN = 't2.solidi.co'; // Use actual domain, not www.solidi.co

// Create HMAC signature exactly like test-all-apis.js that WORKS
function createSignature(dataToSign, apiSecret) {
  // Convert secret to base64 first (like real app)
  const secretBase64 = Buffer.from(apiSecret).toString('base64');
  // Create HMAC and return as base64
  const hmac = crypto.createHmac('sha256', secretBase64);
  hmac.update(dataToSign);
  return hmac.digest('base64');
}

async function testWithdrawAPI() {
  console.log('🧪 Testing Withdraw API with WORKING Method...');
  console.log(`🔑 API Key: ${API_KEY.substring(0, 8)}...`);
  console.log(`🏠 Base URL: ${BASE_URL}`);
  console.log(`📝 Signing Domain: ${SIGNING_DOMAIN}`);
  console.log('');

  // Test data - very small amount with correct priority
  let nonce = Date.now() * 1000 + 600; // Start higher to avoid conflicts
  const withdrawData = {
    volume: '0.00001',  // Very small amount: 0.00001 BTC (~$1.20)
    address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell',  // Your address
    priority: 'medium',  // Correct priority based on our tests
    nonce: nonce
  };

  const path = '/api2/v1/withdraw/BTC';
  const postData = JSON.stringify(withdrawData);
  
  // Create signature using the WORKING method from test-all-apis.js
  const dataToSign = SIGNING_DOMAIN + path + postData;
  const signature = createSignature(dataToSign, API_SECRET);
  
  console.log('📤 Request Data:');
  console.log(`- Path: ${path}`);
  console.log(`- Nonce: ${nonce}`);
  console.log(`- Post Data: ${postData}`);
  console.log(`- Data to sign: ${dataToSign.substring(0, 80)}...`);
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
      'User-Agent': 'SolidiMobileApp/Test'
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
            
            // Analyze the error type
            if (jsonResponse.error.includes('nonce')) {
              console.log('🔍 Nonce error - authentication working, just nonce issue');
            } else if (jsonResponse.error.includes('verify')) {
              console.log('🔍 Signature verification error - need to fix signature');
            } else if (jsonResponse.error.includes('param') || jsonResponse.error.includes('address') || jsonResponse.error.includes('volume')) {
              console.log('✅ Authentication working! This is a parameter validation error');
            } else if (jsonResponse.error.includes('balance') || jsonResponse.error.includes('insufficient')) {
              console.log('✅ Authentication working! Balance/limit error - transaction would work with sufficient funds');
            } else {
              console.log('🔍 Other error type - need to investigate');
            }
          } else if (jsonResponse.id) {
            console.log('');
            console.log('🎉 SUCCESS! Transaction ID:', jsonResponse.id);
            console.log('✅ The withdraw API is working perfectly!');
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