#!/usr/bin/env node

/**
 * Test withdraw API with different parameters to isolate the issue
 */

const https = require('https');
const crypto = require('crypto');

// Real API credentials from test-all-apis.js
const API_KEY = 'iqZKMVbnCcXgpLteFaSuUMbndUw4BkWSCrXylu8PycdcGNBKXKF56twx';
const API_SECRET = 'AL8N3xtau892JbZLJPnEUhnzVZBOVpVw93GMfJL9CP1s1sHQN9YfDIh3crHzXecamZS8vkS7WO7fuBqQzKFHiQaM';
const BASE_URL = 'https://t2.solidi.co/api2/v1';
const SIGNING_DOMAIN = 't2.solidi.co';

// Create HMAC signature exactly like test-all-apis.js that WORKS
function createSignature(dataToSign, apiSecret) {
  const secretBase64 = Buffer.from(apiSecret).toString('base64');
  const hmac = crypto.createHmac('sha256', secretBase64);
  hmac.update(dataToSign);
  return hmac.digest('base64');
}

async function testWithdraw(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📤 Parameters: ${JSON.stringify(testCase.params, null, 2)}`);

  const path = '/api2/v1/withdraw/BTC';
  const postData = JSON.stringify(testCase.params);
  
  const dataToSign = SIGNING_DOMAIN + path + postData;
  const signature = createSignature(dataToSign, API_SECRET);

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
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(data);
          console.log(`📨 Response: ${JSON.stringify(jsonResponse, null, 2)}`);
          
          if (jsonResponse.error) {
            console.log(`❌ Error: ${jsonResponse.error}`);
          } else if (jsonResponse.id) {
            console.log(`✅ SUCCESS! Transaction ID: ${jsonResponse.id}`);
          }
          
          resolve(jsonResponse);
        } catch (e) {
          console.log(`💥 Parse error: ${e.message}`);
          console.log(`📨 Raw: ${data}`);
          resolve({ parseError: data });
        }
      });
    });

    req.on('error', (e) => {
      console.log(`💥 Request Error: ${e.message}`);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing BTC Withdraw API with Different Parameters...');
  
  let baseNonce = Date.now() * 1000;
  
  const testCases = [
    {
      name: "Very small amount with your address",
      params: {
        volume: '0.00001',
        address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell',
        priority: 'medium',
        nonce: baseNonce + 1
      }
    },
    {
      name: "Very small amount with Bitcoin genesis address",
      params: {
        volume: '0.00001',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        priority: 'medium',
        nonce: baseNonce + 2
      }
    },
    {
      name: "Extremely small amount",
      params: {
        volume: '0.000001',
        address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell',
        priority: 'medium',
        nonce: baseNonce + 3
      }
    },
    {
      name: "Low priority test",
      params: {
        volume: '0.00001',
        address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell',
        priority: 'low',
        nonce: baseNonce + 4
      }
    },
    {
      name: "High priority test",
      params: {
        volume: '0.00001',
        address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell',
        priority: 'high',
        nonce: baseNonce + 5
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      await testWithdraw(testCase);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
    } catch (error) {
      console.log(`💥 Test failed: ${error.message}`);
    }
  }
  
  console.log('\n🏁 All tests completed!');
}

runTests();