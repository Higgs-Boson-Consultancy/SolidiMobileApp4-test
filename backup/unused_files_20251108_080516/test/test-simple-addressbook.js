// Simple Node.js Address Book API Test
// This tests the API endpoints directly using Node.js

const https = require('https');
const crypto = require('crypto');

// Configuration
const appTier = 'dev'; // Change to match your environment
const domains = {
  dev: 't2.solidi.co',
  stag: 't10.solidi.co',
  prod: 'www.solidi.co',
};

const domain = domains[appTier];
const userAgent = 'SolidiMobileApp4-AddressBookTest/1.0.0';

console.log('🧪 ===== SIMPLE ADDRESS BOOK API TEST =====');
console.log(`🌐 Testing: ${appTier} environment (${domain})`);

// Function to make HTTPS request
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Test API availability
async function testAPIAvailability() {
  console.log('\n🌐 Testing API availability...');
  
  try {
    const options = {
      hostname: domain,
      port: 443,
      path: '/api/hello',
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options);
    
    console.log('🎯 API Availability Test Result:');
    console.log(`   Status Code: ${response.statusCode}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.statusCode === 200 || response.statusCode === 401) {
      console.log('✅ API is reachable');
      return true;
    } else {
      console.log('❌ API may be unreachable');
      return false;
    }
    
  } catch (error) {
    console.error('💥 API availability test failed:', error.message);
    return false;
  }
}

// Test address book endpoint structure (without authentication)
async function testAddressBookEndpoint(asset = 'BTC') {
  console.log(`\n📋 Testing address book endpoint for ${asset}...`);
  
  try {
    const options = {
      hostname: domain,
      port: 443,
      path: `/api/addressBook/${asset}`,
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options);
    
    console.log(`🎯 Address Book ${asset} Test Result:`);
    console.log(`   Status Code: ${response.statusCode}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.statusCode === 401) {
      console.log(`✅ ${asset} endpoint exists but requires authentication (expected)`);
      return true;
    } else if (response.statusCode === 404) {
      console.log(`❌ ${asset} endpoint not found`);
      return false;
    } else {
      console.log(`🤔 ${asset} endpoint returned unexpected status: ${response.statusCode}`);
      return response.statusCode === 200;
    }
    
  } catch (error) {
    console.error(`💥 ${asset} endpoint test failed:`, error.message);
    return false;
  }
}

// Test with authentication (if you provide credentials)
async function testWithAuth(apiKey, apiSecret, asset = 'BTC') {
  if (!apiKey || !apiSecret) {
    console.log('\n⚠️ No credentials provided for authenticated test');
    return null;
  }
  
  console.log(`\n🔐 Testing authenticated ${asset} address book request...`);
  
  try {
    const timestamp = Date.now().toString();
    const method = 'GET';
    const path = `/api/addressBook/${asset}`;
    const body = '';
    
    // Create signature (this is a simplified version - check your actual HMAC implementation)
    const message = timestamp + method + path + body;
    const signature = crypto.createHmac('sha256', apiSecret).update(message).digest('hex');
    
    const options = {
      hostname: domain,
      port: 443,
      path: path,
      method: method,
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/json',
        'API-Key': apiKey,
        'API-Signature': signature,
        'API-Timestamp': timestamp
      }
    };
    
    const response = await makeRequest(options);
    
    console.log(`🎯 Authenticated ${asset} Address Book Result:`);
    console.log(`   Status Code: ${response.statusCode}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.statusCode === 200 && response.data.success) {
      const addresses = response.data.data?.addresses || [];
      console.log(`✅ ${asset} address book loaded successfully!`);
      console.log(`📊 Found ${addresses.length} addresses:`);
      
      if (addresses.length > 0) {
        addresses.forEach((addr, i) => {
          console.log(`   ${i+1}. ${addr.name || 'Unnamed'}: ${addr.address || 'N/A'}`);
        });
      } else {
        console.log('   📝 No addresses found in your address book');
      }
      
      return addresses;
    } else {
      console.log(`❌ Authentication failed or error: ${response.data?.message || 'Unknown error'}`);
      return null;
    }
    
  } catch (error) {
    console.error(`💥 Authenticated test failed:`, error.message);
    return null;
  }
}

// Main test runner
async function runAddressBookTest() {
  console.log('🚀 Starting Address Book API Test...');
  console.log(`📅 Test Time: ${new Date().toISOString()}`);
  
  // Test 1: Basic API availability
  const isAPIAvailable = await testAPIAvailability();
  
  if (!isAPIAvailable) {
    console.log('\n⚠️ WARNING: Basic API connectivity failed');
    console.log('   Continuing with endpoint tests anyway...');
  }
  
  // Test 2: Address book endpoints
  const assets = ['BTC', 'ETH', 'GBP'];
  const endpointResults = {};
  
  for (const asset of assets) {
    endpointResults[asset] = await testAddressBookEndpoint(asset);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Test 3: Show how to test with authentication
  console.log('\n🔐 ===== AUTHENTICATION TEST =====');
  console.log('💡 To test with your actual address book data:');
  console.log('   1. Get your API key and secret from the mobile app');
  console.log('   2. Run: testWithAuth("your-api-key", "your-api-secret", "BTC")');
  console.log('   3. Or modify this script to include your credentials');
  
  // Summary
  console.log('\n📊 ===== TEST SUMMARY =====');
  console.log(`🌐 API Available: ${isAPIAvailable ? '✅ Yes' : '❌ No'}`);
  console.log('📋 Address Book Endpoints:');
  Object.entries(endpointResults).forEach(([asset, available]) => {
    console.log(`   ${asset}: ${available ? '✅ Available' : '❌ Not Found'}`);
  });
  
  console.log('\n📝 Next Steps:');
  console.log('   • If endpoints are available, provide API credentials to see your actual data');
  console.log('   • Check your mobile app for API key/secret in settings');
  console.log('   • Ensure you have addresses saved in your mobile app address book');
}

// Export functions for direct usage
module.exports = {
  testAPIAvailability,
  testAddressBookEndpoint,
  testWithAuth,
  runAddressBookTest
};

// Run if called directly
if (require.main === module) {
  runAddressBookTest().catch(console.error);
}