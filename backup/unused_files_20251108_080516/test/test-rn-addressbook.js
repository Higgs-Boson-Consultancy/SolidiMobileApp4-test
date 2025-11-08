// React Native Compatible Address Book Test
// Run this in your React Native environment or Metro bundler

import SolidiRestAPIClientLibrary from '../src/api/SolidiRestAPIClientLibrary.js';

// Configuration
const appTier = 'dev'; // Change to 'stag' or 'prod' as needed
const domains = {
  dev: 't2.solidi.co',
  stag: 't10.solidi.co', 
  prod: 'www.solidi.co',
};

const domain = domains[appTier];
const userAgent = 'SolidiMobileApp4-AddressBookTest/1.0.0';

console.log('🧪 ===== REACT NATIVE ADDRESS BOOK API TEST =====');
console.log(`🌐 Environment: ${appTier} (${domain})`);

// Simple address book test function
export const testMyAddressBook = async (apiKey = '', apiSecret = '') => {
  console.log('\n🔍 Testing Address Book API...');
  
  if (!apiKey || !apiSecret) {
    console.log('⚠️ WARNING: No API credentials provided');
    console.log('💡 You need to provide apiKey and apiSecret to test');
    console.log('📝 Usage: testMyAddressBook("your-api-key", "your-api-secret")');
    return;
  }
  
  try {
    // Create API client
    const apiClient = new SolidiRestAPIClientLibrary({
      userAgent: userAgent,
      apiKey: apiKey,
      apiSecret: apiSecret,
      domain: domain
    });
    
    console.log('✅ API client initialized');
    
    // Test all asset types
    const assets = ['BTC', 'ETH', 'GBP'];
    const results = {};
    
    for (const asset of assets) {
      console.log(`\n📋 Checking ${asset} address book...`);
      
      try {
        const response = await apiClient.privateMethod({
          httpMethod: 'GET',
          apiRoute: `addressBook/${asset}`,
          params: {}
        });
        
        console.log(`🎯 ${asset} Response:`, response);
        
        if (response && response.success) {
          const addresses = response.data?.addresses || [];
          results[asset] = addresses;
          
          console.log(`✅ ${asset}: ${addresses.length} addresses found`);
          
          if (addresses.length > 0) {
            console.log(`📝 ${asset} Address Details:`);
            addresses.forEach((addr, i) => {
              console.log(`  ${i+1}. Name: "${addr.name || 'Unnamed'}"`);
              console.log(`     Address: ${addr.address || 'N/A'}`);
              console.log(`     Type: ${addr.type || 'Unknown'}`);
              console.log(`     Created: ${addr.createdAt || 'Unknown'}`);
              console.log('     ---');
            });
          } else {
            console.log(`📝 No ${asset} addresses in your address book`);
          }
        } else {
          console.log(`❌ ${asset} API failed:`, response?.message || 'Unknown error');
          results[asset] = null;
        }
        
      } catch (error) {
        console.error(`💥 ${asset} API error:`, error.message);
        results[asset] = null;
      }
    }
    
    // Summary
    console.log('\n📊 ===== SUMMARY =====');
    Object.keys(results).forEach(asset => {
      const addresses = results[asset];
      if (addresses === null) {
        console.log(`❌ ${asset}: API Error`);
      } else if (addresses.length === 0) {
        console.log(`📝 ${asset}: Empty (0 addresses)`);
      } else {
        console.log(`✅ ${asset}: ${addresses.length} addresses`);
      }
    });
    
    return results;
    
  } catch (error) {
    console.error('💥 Critical test error:', error);
    return null;
  }
};

// Quick test without credentials (for structure check)
export const testAddressBookStructure = async () => {
  console.log('\n🔧 Testing Address Book API Structure (no auth)...');
  
  try {
    const apiClient = new SolidiRestAPIClientLibrary({
      userAgent: userAgent,
      apiKey: '',
      apiSecret: '',
      domain: domain
    });
    
    // Try to call the API without credentials to see the error structure
    const response = await apiClient.privateMethod({
      httpMethod: 'GET',
      apiRoute: 'addressBook/BTC',
      params: {}
    });
    
    console.log('🎯 Unauthenticated response:', response);
    
    if (response && response.message) {
      if (response.message.includes('auth') || response.message.includes('key')) {
        console.log('✅ API is reachable - authentication required (expected)');
        return true;
      }
    }
    
  } catch (error) {
    console.log('🔍 API Structure Test Error:', error.message);
    
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      console.log('✅ API is reachable - authentication error (expected)');
      return true;
    } else {
      console.log('❌ API might be unreachable');
      return false;
    }
  }
  
  return false;
};

// Automated test that tries to extract credentials from your app state
export const testWithAppCredentials = async () => {
  console.log('\n🔐 Attempting to test with app credentials...');
  
  try {
    // Try to access stored credentials (React Native Keychain)
    const Keychain = require('@react-native-keychain/react-native-keychain');
    
    const storedCredentials = await Keychain.getGenericPassword({
      service: 'API_dev_SolidiMobileApp_t2.solidi.co' // Adjust for your environment
    });
    
    if (storedCredentials) {
      console.log('✅ Found stored credentials');
      const { username: apiKey, password: apiSecret } = storedCredentials;
      
      return await testMyAddressBook(apiKey, apiSecret);
    } else {
      console.log('❌ No stored credentials found');
      console.log('💡 Please login to the app first, then try again');
      return null;
    }
    
  } catch (error) {
    console.log('⚠️ Could not access stored credentials:', error.message);
    console.log('💡 Please provide credentials manually using testMyAddressBook(key, secret)');
    return null;
  }
};

// Default export for easy usage
const AddressBookTester = {
  testMyAddressBook,
  testAddressBookStructure,
  testWithAppCredentials
};

export default AddressBookTester;

// Auto-run structure test if running directly
console.log('\n🚀 Address Book API Tester Ready!');
console.log('📖 Available functions:');
console.log('  • testMyAddressBook(apiKey, apiSecret) - Test with your credentials');
console.log('  • testAddressBookStructure() - Test API availability');
console.log('  • testWithAppCredentials() - Auto-extract app credentials');
console.log('\n💡 Example usage:');
console.log('  import AddressBookTester from "./test-rn-addressbook.js";');
console.log('  AddressBookTester.testMyAddressBook("your-key", "your-secret");');