// Advanced Address Book Test with Credential Discovery
// This helps find your API credentials and test your actual address book

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Configuration
const appTier = 'dev';
const domain = 't2.solidi.co';
const userAgent = 'SolidiMobileApp4-AddressBookTest/1.0.0';

console.log('🔍 ===== ADVANCED ADDRESS BOOK TEST =====');
console.log(`🌐 Environment: ${appTier} (${domain})`);

// Function to search for potential API credentials in your project
function searchForCredentials() {
  console.log('\n🔎 Searching for potential API credentials in your project...');
  
  const searchPaths = [
    './src/application/data/AppState.js',
    './package.json',
    './app.json'
  ];
  
  const potentialKeys = [];
  
  searchPaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Look for patterns that might be API keys
        const patterns = [
          /apiKey['":\s]*['"]([^'"]+)['"]/gi,
          /api[_-]?key['":\s]*['"]([^'"]+)['"]/gi,
          /apiSecret['":\s]*['"]([^'"]+)['"]/gi,
          /api[_-]?secret['":\s]*['"]([^'"]+)['"]/gi,
          /key['":\s]*['"]([a-zA-Z0-9]{20,})['"]/gi,
          /secret['":\s]*['"]([a-zA-Z0-9]{20,})['"]/gi
        ];
        
        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            if (match[1] && match[1].length > 10) {
              potentialKeys.push({
                file: filePath,
                type: match[0].includes('Secret') ? 'secret' : 'key',
                value: match[1],
                context: match[0]
              });
            }
          }
        });
      }
    } catch (error) {
      console.log(`⚠️ Could not read ${filePath}:`, error.message);
    }
  });
  
  if (potentialKeys.length > 0) {
    console.log('🎯 Found potential credentials:');
    potentialKeys.forEach((cred, i) => {
      console.log(`   ${i+1}. ${cred.type.toUpperCase()} in ${cred.file}:`);
      console.log(`      Context: ${cred.context}`);
      console.log(`      Value: ${cred.value.substring(0, 8)}...${cred.value.substring(cred.value.length-4)}`);
    });
  } else {
    console.log('❌ No potential credentials found in source files');
  }
  
  return potentialKeys;
}

// Enhanced HMAC signature generation
function generateSignature(apiSecret, timestamp, method, path, body = '') {
  const message = timestamp + method + path + body;
  return crypto.createHmac('sha256', apiSecret).update(message).digest('hex');
}

// Make authenticated API request
async function makeAuthenticatedRequest(apiKey, apiSecret, asset) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now().toString();
    const method = 'GET';
    const path = `/api/addressBook/${asset}`;
    const body = '';
    
    const signature = generateSignature(apiSecret, timestamp, method, path, body);
    
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
    
    console.log(`🔐 Making authenticated request for ${asset}...`);
    console.log(`   API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length-4)}`);
    console.log(`   Timestamp: ${timestamp}`);
    console.log(`   Signature: ${signature.substring(0, 16)}...`);
    
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({
            statusCode: res.statusCode,
            data: parsed,
            raw: responseBody
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: responseBody,
            raw: responseBody
          });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Test address book with credentials
async function testAddressBookWithCredentials(apiKey, apiSecret) {
  console.log('\n🧪 Testing address book with provided credentials...');
  
  const assets = ['BTC', 'ETH', 'GBP'];
  const results = {};
  
  for (const asset of assets) {
    try {
      console.log(`\n📋 Testing ${asset} address book...`);
      
      const response = await makeAuthenticatedRequest(apiKey, apiSecret, asset);
      
      console.log(`🎯 ${asset} Response Status: ${response.statusCode}`);
      console.log(`📊 ${asset} Response Data:`, JSON.stringify(response.data, null, 2));
      
      if (response.statusCode === 200 && response.data && response.data.success) {
        const addresses = response.data.data?.addresses || [];
        results[asset] = addresses;
        
        console.log(`✅ ${asset}: Successfully loaded ${addresses.length} addresses`);
        
        if (addresses.length > 0) {
          console.log(`📝 ${asset} Address Book Contents:`);
          addresses.forEach((addr, i) => {
            console.log(`   ${i+1}. Name: "${addr.name || 'Unnamed'}"`);
            console.log(`      Address: ${addr.address || 'N/A'}`);
            console.log(`      Type: ${addr.type || 'Unknown'}`);
            console.log(`      Created: ${addr.createdAt || 'Unknown'}`);
            if (addr.description) {
              console.log(`      Description: ${addr.description}`);
            }
            console.log('      ---');
          });
        } else {
          console.log(`   📝 Your ${asset} address book is empty`);
        }
      } else if (response.statusCode === 401) {
        console.log(`❌ ${asset}: Authentication failed - check your API credentials`);
        results[asset] = null;
      } else {
        console.log(`❌ ${asset}: API error - ${response.data?.message || 'Unknown error'}`);
        results[asset] = null;
      }
      
    } catch (error) {
      console.error(`💥 ${asset} request failed:`, error.message);
      results[asset] = null;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// Interactive credential input (for command line usage)
async function promptForCredentials() {
  console.log('\n🔑 Please provide your API credentials:');
  console.log('💡 You can find these in your mobile app settings or AppState.js file');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('🔑 Enter your API Key: ', (apiKey) => {
      rl.question('🔐 Enter your API Secret: ', (apiSecret) => {
        rl.close();
        resolve({ apiKey: apiKey.trim(), apiSecret: apiSecret.trim() });
      });
    });
  });
}

// Main test function
async function runFullAddressBookTest() {
  console.log('🚀 Starting comprehensive address book test...');
  console.log(`📅 Test Time: ${new Date().toISOString()}`);
  
  // Step 1: Search for credentials in project files
  const foundCredentials = searchForCredentials();
  
  // Step 2: Check if we can use found credentials
  let apiKey = '';
  let apiSecret = '';
  
  if (foundCredentials.length >= 2) {
    const keyCandidate = foundCredentials.find(c => c.type === 'key');
    const secretCandidate = foundCredentials.find(c => c.type === 'secret');
    
    if (keyCandidate && secretCandidate) {
      console.log('\n🎯 Found potential API key/secret pair in project files');
      console.log('⚡ Attempting automatic test with found credentials...');
      
      apiKey = keyCandidate.value;
      apiSecret = secretCandidate.value;
    }
  }
  
  // Step 3: If no credentials found, prompt for them (interactive mode)
  if (!apiKey || !apiSecret) {
    console.log('\n❌ No valid credentials found automatically');
    console.log('📝 You have two options:');
    console.log('   1. Add your API credentials to this script manually');
    console.log('   2. Provide them interactively (if running in terminal)');
    
    // For non-interactive environments, provide manual instruction
    if (process.env.NODE_ENV !== 'interactive') {
      console.log('\n📖 MANUAL TESTING INSTRUCTIONS:');
      console.log('   1. Edit this file and add your credentials:');
      console.log('      const apiKey = "your-api-key-here";');
      console.log('      const apiSecret = "your-api-secret-here";');
      console.log('   2. Or run: node test-advanced-addressbook.js interactive');
      console.log('   3. Or get credentials from your mobile app and call:');
      console.log('      testAddressBookWithCredentials("key", "secret")');
      return;
    }
    
    const credentials = await promptForCredentials();
    apiKey = credentials.apiKey;
    apiSecret = credentials.apiSecret;
  }
  
  // Step 4: Test with credentials
  if (apiKey && apiSecret) {
    const results = await testAddressBookWithCredentials(apiKey, apiSecret);
    
    // Step 5: Summary
    console.log('\n📊 ===== FINAL SUMMARY =====');
    let totalAddresses = 0;
    Object.entries(results).forEach(([asset, addresses]) => {
      if (addresses) {
        console.log(`✅ ${asset}: ${addresses.length} addresses`);
        totalAddresses += addresses.length;
      } else {
        console.log(`❌ ${asset}: Failed to load`);
      }
    });
    
    console.log(`\n🎯 Total addresses in your address book: ${totalAddresses}`);
    
    if (totalAddresses === 0) {
      console.log('\n💡 Your address book appears to be empty. To test:');
      console.log('   1. Open your mobile app');
      console.log('   2. Go to Address Book and add some addresses');
      console.log('   3. Run this test again to see them');
    } else {
      console.log('\n🎉 Address book test completed successfully!');
      console.log('   Your addresses are loading correctly from the API');
    }
    
  } else {
    console.log('\n❌ No credentials provided - cannot test address book contents');
  }
}

// Export for module usage
module.exports = {
  searchForCredentials,
  testAddressBookWithCredentials,
  runFullAddressBookTest,
  generateSignature,
  makeAuthenticatedRequest
};

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('interactive')) {
    process.env.NODE_ENV = 'interactive';
  }
  
  // Allow manual credential testing via command line
  if (args.length >= 2 && !args.includes('interactive')) {
    const [key, secret, asset = 'BTC'] = args;
    console.log(`🎯 Testing with provided credentials for ${asset}...`);
    testAddressBookWithCredentials(key, secret).catch(console.error);
  } else {
    runFullAddressBookTest().catch(console.error);
  }
}