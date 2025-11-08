// External Address Book API Test Script
// This script tests the address book API endpoints independently

console.log('🧪 ===== ADDRESS BOOK API EXTERNAL TEST =====');

// Import required modules
const SolidiRestAPIClientLibrary = require('../src/api/SolidiRestAPIClientLibrary.js');

// Configuration - Update these values based on your app tier
const appTier = 'dev'; // or 'stag' or 'prod' 
const domains = {
  dev: 't2.solidi.co',
  stag: 't10.solidi.co',
  prod: 'www.solidi.co',
};

const domain = domains[appTier];
const userAgent = 'SolidiMobileApp4-AddressBookTest/1.0.0';

console.log(`🌐 Testing against: ${appTier} environment (${domain})`);

// Test function to list address book for all assets
async function testAddressBookAPI() {
  try {
    console.log('\n🔧 Setting up API client...');
    
    // Create API client instance
    // Note: You'll need to provide real API credentials
    const apiClient = new SolidiRestAPIClientLibrary({
      userAgent: userAgent,
      apiKey: '', // You'll need to provide your API key
      apiSecret: '', // You'll need to provide your API secret
      domain: domain
    });
    
    console.log('✅ API client created successfully');
    
    // Test each asset type
    const assets = ['BTC', 'ETH', 'GBP'];
    
    for (const asset of assets) {
      console.log(`\n📋 ===== TESTING ${asset} ADDRESS BOOK =====`);
      
      try {
        const result = await apiClient.privateMethod({
          httpMethod: 'GET',
          apiRoute: `addressBook/${asset}`,
          params: {}
        });
        
        console.log(`🎯 ${asset} Address Book API Response:`);
        console.log('📊 Raw Response:', JSON.stringify(result, null, 2));
        
        if (result && result.success) {
          console.log(`✅ ${asset} API call successful`);
          
          if (result.data && result.data.addresses) {
            console.log(`📈 ${asset} Addresses found: ${result.data.addresses.length}`);
            
            if (result.data.addresses.length > 0) {
              console.log(`🏠 ${asset} Address List:`);
              result.data.addresses.forEach((addr, index) => {
                console.log(`  ${index + 1}. ${addr.name || 'Unnamed'}: ${addr.address || 'No address'}`);
                console.log(`      Type: ${addr.type || 'Unknown'}, Created: ${addr.createdAt || 'Unknown'}`);
              });
            } else {
              console.log(`📝 No ${asset} addresses found in your address book`);
            }
          } else {
            console.log(`⚠️ ${asset} response missing addresses data`);
          }
        } else {
          console.log(`❌ ${asset} API call failed:`, result?.message || 'Unknown error');
        }
        
      } catch (error) {
        console.error(`💥 Error testing ${asset} address book:`, error.message);
        console.error('Stack:', error.stack);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n🏁 Address Book API test completed');
    
  } catch (error) {
    console.error('💥 Critical error in address book test:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Test function to check API connectivity
async function testAPIConnectivity() {
  console.log('\n🌐 Testing basic API connectivity...');
  
  try {
    const apiClient = new SolidiRestAPIClientLibrary({
      userAgent: userAgent,
      apiKey: '',
      apiSecret: '',
      domain: domain
    });
    
    // Test a simple public endpoint first
    const result = await apiClient.publicMethod({
      httpMethod: 'GET',
      apiRoute: 'hello',
      params: {}
    });
    
    console.log('🎯 API Connectivity Test Result:', result);
    
    if (result) {
      console.log('✅ API is reachable');
      return true;
    } else {
      console.log('❌ API unreachable or no response');
      return false;
    }
    
  } catch (error) {
    console.error('💥 API connectivity test failed:', error.message);
    return false;
  }
}

// Main execution
async function runAddressBookTest() {
  console.log('🚀 Starting Address Book External API Test...');
  console.log('📅 Test Date:', new Date().toISOString());
  
  // Step 1: Test basic connectivity
  const isConnected = await testAPIConnectivity();
  
  if (!isConnected) {
    console.log('\n⚠️ WARNING: Basic API connectivity failed');
    console.log('   This might affect address book API calls');
    console.log('   Continuing with address book test anyway...\n');
  }
  
  // Step 2: Test address book endpoints
  await testAddressBookAPI();
  
  console.log('\n📋 ===== TEST SUMMARY =====');
  console.log('✅ External address book API test completed');
  console.log('📝 Check the logs above for your address book contents');
  console.log('🔍 If you see "No addresses found", your address book might be empty');
  console.log('💡 Use the mobile app to add some addresses first, then re-run this test');
}

// Export for Node.js usage or run directly
if (require.main === module) {
  runAddressBookTest().catch(console.error);
} else {
  module.exports = { testAddressBookAPI, testAPIConnectivity, runAddressBookTest };
}

console.log('\n📖 HOW TO USE THIS SCRIPT:');
console.log('1. Make sure you have API credentials (apiKey and apiSecret)');
console.log('2. Update the apiKey and apiSecret variables in this script');
console.log('3. Run: node test-external-addressbook.js');
console.log('4. Check the output for your address book contents');