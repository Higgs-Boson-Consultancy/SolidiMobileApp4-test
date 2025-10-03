#!/usr/bin/env node

// Test script to verify the withdraw API is working
const https = require('https');
const crypto = require('crypto');

// Test credentials from API_DOCUMENTATION.md
const apiKey = 'your_api_key_here';
const apiSecret = 'your_api_secret_here';

// Create HMAC signature
function createSignature(path, postData, nonce) {
  const message = path + crypto.createHash('sha256').update(nonce + postData).digest();
  return crypto.createHmac('sha512', Buffer.from(apiSecret, 'base64')).update(message).digest('base64');
}

async function testWithdrawAPI() {
  console.log('🧪 Testing Withdraw API...');
  
  const nonce = Date.now() * 1000000; // Microsecond timestamp
  const path = '/api2/v1/withdraw/BTC';
  
  // Test withdraw data
  const withdrawData = {
    nonce,
    volume: '0.001',
    addressInfo: {
      address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell'
    },
    priority: 'medium'
  };
  
  const postData = JSON.stringify(withdrawData);
  const signature = createSignature(path, postData, nonce);
  
  const options = {
    hostname: 't2.solidi.co',
    port: 443,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length,
      'API-Key': apiKey,
      'API-Sign': signature
    }
  };

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    console.log('📡 Status (with auth):', response.status);
    console.log('📡 Response (with auth):', response.data);
    
    if (response.status === 200) {
      try {
        const parsed = JSON.parse(response.data);
        if (parsed.error) {
          console.log('❌ API Error:', parsed.error);
        } else if (parsed.id) {
          console.log('✅ Withdraw would succeed with ID:', parsed.id);
        } else {
          console.log('⚠️ Unexpected response format:', parsed);
        }
      } catch (e) {
        console.log('❌ Failed to parse JSON response');
      }
    } else {
      console.log('❌ HTTP Error:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

async function main() {
  console.log('=== WITHDRAW API TEST ===\n');
  
  if (apiKey === 'your_api_key_here' || apiSecret === 'your_api_secret_here') {
    console.log('⚠️ Skipping authenticated test - please add real API credentials');
    console.log('⚠️ Update apiKey and apiSecret variables in this file');
    console.log('\n=== TEST COMPLETE ===');
    return;
  }
  
  await testWithdrawAPI();
  console.log('\n=== TEST COMPLETE ===');
}

main().catch(console.error);