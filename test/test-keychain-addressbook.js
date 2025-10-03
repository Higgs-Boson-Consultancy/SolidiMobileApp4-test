// Keychain-Aware Address Book Test
// This test extracts your real API credentials from the keychain and tests your address book

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const crypto = require('crypto');

// Configuration matching your app
const appTier = 'dev';
const appName = 'SolidiMobileApp';
const domain = 't2.solidi.co';
const apiCredentialsStorageKey = `API_${appTier}_${appName}_${domain}`;

console.log('🔐 ===== KEYCHAIN-AWARE ADDRESS BOOK TEST =====');
console.log(`🌐 Environment: ${appTier} (${domain})`);
console.log(`🔑 Keychain Key: ${apiCredentialsStorageKey}`);

// Function to extract credentials from macOS Keychain
function extractKeychainCredentials() {
  console.log('\n🔍 Attempting to extract API credentials from macOS Keychain...');
  
  try {
    // Try to find the keychain entry using security command
    console.log(`🔑 Looking for keychain entry: ${apiCredentialsStorageKey}`);
    
    // List all keychain entries related to Solidi
    try {
      const listCommand = `security find-internet-password -s "${domain}" -a "${apiCredentialsStorageKey}" -g 2>&1`;
      console.log(`🔍 Executing: ${listCommand}`);
      
      const output = execSync(listCommand, { encoding: 'utf-8', stdio: 'pipe' });
      console.log('🎯 Keychain search output:', output);
      
      // Parse the output to extract credentials
      const lines = output.split('\n');
      let apiKey = '';
      let apiSecret = '';
      
      for (const line of lines) {
        if (line.includes('password:')) {
          // This would be the API secret
          const match = line.match(/password:\s*"([^"]+)"/);
          if (match) {
            apiSecret = match[1];
          }
        }
        if (line.includes('acct')) {
          // This would be the API key
          const match = line.match(/"([^"]+)"/);
          if (match) {
            apiKey = match[1];
          }
        }
      }
      
      if (apiKey && apiSecret) {
        console.log('✅ Successfully extracted credentials from keychain!');
        console.log(`🔑 API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length-4)}`);
        console.log(`🔐 API Secret: ${apiSecret.substring(0, 8)}...${apiSecret.substring(apiSecret.length-4)}`);
        return { apiKey, apiSecret };
      } else {
        console.log('❌ Could not parse credentials from keychain output');
        return null;
      }
      
    } catch (error) {
      console.log('⚠️ Security command failed:', error.message);
      
      // Try alternative approach - list all internet passwords and filter
      try {
        console.log('🔄 Trying alternative keychain search...');
        const altCommand = `security dump-keychain -d login.keychain 2>/dev/null | grep -A 10 -B 10 "${domain}"`;
        const altOutput = execSync(altCommand, { encoding: 'utf-8', stdio: 'pipe' });
        console.log('🎯 Alternative search results:', altOutput);
        
        if (altOutput.length > 0) {
          console.log('💡 Found some Solidi-related keychain entries');
          console.log('   You may need to manually extract the API credentials');
        } else {
          console.log('❌ No Solidi-related keychain entries found');
        }
        
      } catch (altError) {
        console.log('⚠️ Alternative keychain search also failed:', altError.message);
      }
      
      return null;
    }
    
  } catch (error) {
    console.error('💥 Keychain extraction failed:', error.message);
    return null;
  }
}

// Function to check simulator keychain (if running on iOS simulator)
function checkSimulatorKeychain() {
  console.log('\n📱 Checking iOS Simulator keychain...');
  
  try {
    // iOS Simulator keychain location
    const homeDir = process.env.HOME;
    const simKeychainPath = path.join(homeDir, 'Library/Developer/CoreSimulator/Devices');
    
    if (fs.existsSync(simKeychainPath)) {
      console.log('✅ iOS Simulator directory found');
      console.log('💡 Simulator keychain requires iOS-specific tools to extract');
      console.log('   Your credentials are likely stored in the simulator keychain');
      return true;
    } else {
      console.log('❌ iOS Simulator directory not found');
      return false;
    }
    
  } catch (error) {
    console.log('⚠️ Could not check simulator keychain:', error.message);
    return false;
  }
}

// Enhanced HMAC signature matching your app's implementation
function generateSignature(apiSecret, timestamp, method, path, body = '') {
  const message = timestamp + method + path + body;
  return crypto.createHmac('sha256', apiSecret).update(message).digest('hex');
}

// Test address book with extracted credentials
async function testAddressBookWithExtractedCredentials(apiKey, apiSecret) {
  console.log('\n🧪 Testing address book with extracted credentials...');
  
  const assets = ['BTC', 'ETH', 'GBP'];
  const results = {};
  
  for (const asset of assets) {
    console.log(`\n📋 Testing ${asset} address book...`);
    
    try {
      const timestamp = Date.now().toString();
      const method = 'GET';
      const path = `/api/addressBook/${asset}`;
      const signature = generateSignature(apiSecret, timestamp, method, path);
      
      const options = {
        hostname: domain,
        port: 443,
        path: path,
        method: method,
        headers: {
          'User-Agent': 'SolidiMobileApp4-AddressBookTest/1.0.0',
          'Content-Type': 'application/json',
          'API-Key': apiKey,
          'API-Signature': signature,
          'API-Timestamp': timestamp
        }
      };
      
      console.log(`🔐 Making authenticated request for ${asset}...`);
      console.log(`   Timestamp: ${timestamp}`);
      console.log(`   Signature: ${signature.substring(0, 16)}...`);
      
      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              resolve({ statusCode: res.statusCode, data: parsed });
            } catch (e) {
              resolve({ statusCode: res.statusCode, data: body });
            }
          });
        });
        req.on('error', reject);
        req.end();
      });
      
      console.log(`🎯 ${asset} Response Status: ${response.statusCode}`);
      
      if (response.statusCode === 200 && response.data && response.data.success) {
        const addresses = response.data.data?.addresses || [];
        results[asset] = addresses;
        
        console.log(`✅ ${asset}: Successfully loaded ${addresses.length} addresses`);
        console.log(`📊 ${asset} Response:`, JSON.stringify(response.data, null, 2));
        
        if (addresses.length > 0) {
          console.log(`📝 ${asset} Address Book Contents:`);
          addresses.forEach((addr, i) => {
            console.log(`   ${i+1}. Name: "${addr.name || 'Unnamed'}"`);
            console.log(`      Address: ${addr.address || 'N/A'}`);
            console.log(`      Type: ${addr.type || 'Unknown'}`);
            console.log(`      Created: ${addr.createdAt || 'Unknown'}`);
            if (addr.description) console.log(`      Description: ${addr.description}`);
            console.log('      ---');
          });
        } else {
          console.log(`📝 Your ${asset} address book is empty`);
        }
      } else if (response.statusCode === 401) {
        console.log(`❌ ${asset}: Authentication failed`);
        console.log(`📊 Error Response:`, response.data);
        results[asset] = null;
      } else {
        console.log(`❌ ${asset}: API error (${response.statusCode})`);
        console.log(`📊 Error Response:`, response.data);
        results[asset] = null;
      }
      
    } catch (error) {
      console.error(`💥 ${asset} request failed:`, error.message);
      results[asset] = null;
    }
    
    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// Main test function
async function runKeychainAddressBookTest() {
  console.log('🚀 Starting keychain-aware address book test...');
  console.log(`📅 Test Time: ${new Date().toISOString()}`);
  
  // Step 1: Try to extract credentials from keychain
  const credentials = extractKeychainCredentials();
  
  if (credentials && credentials.apiKey && credentials.apiSecret) {
    console.log('\n✅ Credentials extracted successfully from keychain!');
    
    // Step 2: Test address book with extracted credentials
    const results = await testAddressBookWithExtractedCredentials(credentials.apiKey, credentials.apiSecret);
    
    // Step 3: Summary
    console.log('\n📊 ===== FINAL SUMMARY =====');
    let totalAddresses = 0;
    Object.entries(results).forEach(([asset, addresses]) => {
      if (addresses && Array.isArray(addresses)) {
        console.log(`✅ ${asset}: ${addresses.length} addresses`);
        totalAddresses += addresses.length;
      } else {
        console.log(`❌ ${asset}: Failed to load`);
      }
    });
    
    console.log(`\n🎯 Total addresses in your address book: ${totalAddresses}`);
    
    if (totalAddresses === 0) {
      console.log('\n💡 Your address book appears to be empty. To add addresses:');
      console.log('   1. Open your Solidi mobile app');
      console.log('   2. Go to the Address Book section');
      console.log('   3. Add some BTC, ETH, or GBP addresses');
      console.log('   4. Run this test again to see them');
    } else {
      console.log('\n🎉 Address book test completed successfully!');
      console.log('   Your stored addresses are accessible via the API');
    }
    
  } else {
    console.log('\n❌ Could not extract credentials from keychain');
    
    // Step 2: Check for simulator keychain
    const hasSimKeychain = checkSimulatorKeychain();
    
    console.log('\n📖 ALTERNATIVE TESTING OPTIONS:');
    console.log('1. 🔑 Manual Keychain Access:');
    console.log('   • Open "Keychain Access" app on macOS');
    console.log(`   • Search for: ${domain}`);
    console.log('   • Look for entries related to your Solidi app');
    console.log('   • Extract API Key and Secret manually');
    
    console.log('\n2. 📱 Mobile App Method:');
    console.log('   • Open your Solidi mobile app');
    console.log('   • Check app settings for API credentials');
    console.log('   • Look in developer/debug sections');
    
    console.log('\n3. 🔧 Code Method:');
    console.log('   • Add console.log in your app to print credentials');
    console.log('   • Look in AppState.js autoLoginWithStoredCredentials function');
    console.log('   • Temporarily log API key/secret during login');
    
    if (hasSimKeychain) {
      console.log('\n4. 📲 Simulator Method:');
      console.log('   • Your app is likely using iOS Simulator');
      console.log('   • Credentials are stored in simulator keychain');
      console.log('   • Use iOS/React Native keychain debugging tools');
    }
  }
}

// Export for module usage
module.exports = {
  extractKeychainCredentials,
  testAddressBookWithExtractedCredentials,
  runKeychainAddressBookTest,
  generateSignature
};

// Run if called directly
if (require.main === module) {
  runKeychainAddressBookTest().catch(console.error);
}